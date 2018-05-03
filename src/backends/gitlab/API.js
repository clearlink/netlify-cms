import LocalForage from "Lib/LocalForage";
import { Base64 } from "js-base64";
import { fromJS } from "immutable";
import { flow, isString, partial, partialRight, omit, set, update } from "lodash";
import unsentRequest from "Lib/unsentRequest";
import { then } from "Lib/promiseHelper";
import AssetProxy from "ValueObjects/AssetProxy";
import { APIError } from "ValueObjects/errors";

export default class API {
  constructor(config) {
    this.api_root = config.api_root || "https://gitlab.com/api/v4";
    this.token = config.token || false;
    this.branch = config.branch || "master";
    this.repo = config.repo || "";
    this.repoURL = `/projects/${ encodeURIComponent(this.repo) }`;
  }

  withAuthorizationHeaders = req =>
    unsentRequest.withHeaders(this.token ? { Authorization: `Bearer ${ this.token }` } : {}, req);

  buildRequest = req => flow([
    unsentRequest.withRoot(this.api_root),
    this.withAuthorizationHeaders,
    unsentRequest.withTimestamp,
  ])(req);

  request = async req => flow([this.buildRequest, unsentRequest.performRequest])(req);
  requestURL = url => flow([unsentRequest.fromURL, this.request])(url);
  responseToJSON = res => res.json()
  responseToText = res => res.text()
  requestJSON = req => this.request(req).then(this.responseToJSON);
  requestText = req => this.request(req).then(this.responseToText);
  requestJSONFromURL = url => this.requestURL(url).then(this.responseToJSON);
  requestTextFromURL = url => this.requestURL(url).then(this.responseToText);

  user = () => this.requestJSONFromURL("/user");

  WRITE_ACCESS = 30;
  hasWriteAccess = user => this.requestJSONFromURL(this.repoURL).then(({ permissions }) => {
    const { project_access, group_access } = permissions;
    if (project_access && (project_access.access_level >= this.WRITE_ACCESS)) {
      return true;
    }
    if (group_access && (group_access.access_level >= this.WRITE_ACCESS)) {
      return true;
    }
    return false;
  });

  readFile = async (path, sha, ref=this.branch) => {
    const cachedFile = sha ? await LocalForage.getItem(`gl.${ sha }`) : null;
    if (cachedFile) { return cachedFile }
    const result = await this.requestText({
      url: `${ this.repoURL }/repository/files/${ encodeURIComponent(path) }/raw`,
      params: { ref },
      cache: "no-store",
    });
    console.log(result)
    if (sha) { LocalForage.setItem(`gl.${ sha }`, result) }
    return result;
  };

  fileDownloadURL = (path, ref=this.branch) => unsentRequest.toURL(this.buildRequest({
    url: `${ this.repoURL }/repository/files/${ encodeURIComponent(path) }/raw`,
    params: { ref },
  }));

  getCursorFromHeaders = headers => {
    // indices and page counts are assumed to be zero-based, but the
    // indices and page counts returned from GitLab are one-based
    const index = parseInt(headers.get("X-Page"), 10) - 1;
    const pageCount = parseInt(headers.get("X-Total-Pages"), 10) - 1;
    const pageSize = parseInt(headers.get("X-Per-Page"), 10);
    const count = parseInt(headers.get("X-Total"), 10);
    const linksRaw = headers.get("Link");
    const links = linksRaw.split(",")
      .map(str => str.trim().split(";"))
      .map(([linkStr, keyStr]) => [linkStr.trim().match(/<(.*?)>/)[1], keyStr.match(/rel="(.*?)"/)[1]])
      .reduce((acc, [link, key]) => Object.assign(acc, { [key]: unsentRequest.fromURL(link).toJS() }), {});
    return {
      actions: [
        ...((links.prev && index > 0) ? ["prev"] : []),
        ...((links.next && index < pageCount) ? ["next"] : []),
        ...((links.first && index > 0) ? ["first"] : []),
        ...((links.last && index < pageCount) ? ["last"] : []),
      ],
      meta: { index, count, pageSize, pageCount },
      data: { links },
    };
  }

  getCursor = ({ headers }) => this.getCursorFromHeaders(headers)

  // Gets a cursor without retrieving the entries by using a HEAD
  // request
  fetchCursor = flow([unsentRequest.withMethod("HEAD"), this.request, then(this.getCursor)]);
  fetchCursorAndEntries = flow([
    unsentRequest.withMethod("GET"),
    this.request,
    p => Promise.all([p.then(this.getCursor), p.then(this.responseToJSON)]),
    then(([cursor, entries]) => ({ cursor, entries })),
  ]);
  fetchRelativeCursor = async (cursor, action) => this.fetchCursor(cursor.data.links[action]);

  reverseCursor = cursor => fromJS(cursor)
    .updateIn(["data", "links"], flow([
      links => links.toJS(),
      ({ first, last, next, prev }) => ({
        ...(last ? { first: last } : {}),
        ...(first ? { last: first } : {}),
        ...(next ? { prev: next } : {}),
        ...(prev ? { next: prev } : {}),
      }),
    ]))
    .update("actions", actions => actions.map(action => {
      switch (action) {
        case "first": return "last";
        case "last": return "first";
        case "next": return "prev";
        case "prev": return "next";
        default: return action;
      }
    }))
    .update("meta", meta => meta.update("index", index => meta.get("pageCount", 0) - index))
    .toJS();

  getReversedCursor = flow([this.getCursor, this.reverseCursor]);

  // The exported listFiles and traverseCursor reverse the direction
  // of the cursors, since GitLab's pagination sorts the opposite way
  // we want to sort by default (it sorts by filename _descending_,
  // while the CMS defaults to sorting by filename _ascending_, at
  // least in the current GitHub backend). This should eventually be
  // refactored.
  listFiles = async path => {
    const firstPageCursor = await this.fetchCursor({
      url: `${ this.repoURL }/repository/tree`,
      params: { path, ref: this.branch },
    });
    const lastPageLink = firstPageCursor.data.links.last;
    const { entries, cursor } = await this.fetchCursorAndEntries(lastPageLink);
    return { files: entries, cursor: this.reverseCursor(cursor) };
  };

  traverseCursor = async (cursor, action) => {
    const link = cursor.data.links[action];
    const { entries, cursor: newCursor } = await this.fetchCursorAndEntries(link);
    console.log({ entries, newCursor });
    return { entries, cursor: this.reverseCursor(newCursor) };
  };

  listAllEntries = async path => {
    const entries = [];
    let { cursor, entries: initialEntries } = await this.fetchCursorAndEntries({
      url: `${ this.repoURL }/repository/tree`,
      // Get the maximum number of entries per page
      params: { path, ref: this.branch, per_page: 100 },
    });
    entries.push(...initialEntries);
    while (cursor && cursor.actions.includes("next")) {
      const link = cursor.data.links["next"];
      const { cursor: newCursor, entries: newEntries } = await this.fetchCursorAndEntries(link);
      entries.push(...newEntries);
      cursor = newCursor;
      console.log({ cursor, entries });
    }
    return entries;
  };

  toBase64 = str => Promise.resolve(Base64.encode(str));
  fromBase64 = str => Base64.decode(str);
  uploadAndCommit = async (item, { commitMessage, updateFile = false, branch = this.branch }) => {
    const content = await (item instanceof AssetProxy ? item.toBase64() : this.toBase64(item.raw));
    const file_path = item.path.replace(/^\//, "");
    const action = (updateFile ? "update" : "create");
    const encoding = "base64";
    const body = JSON.stringify({
      branch,
      commit_message: commitMessage,
      actions: [{ action, file_path, content, encoding }],
    });

    await this.request({
      url: `${ this.repoURL }/repository/commits`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })

    return { ...item, uploaded: true };
  }

  persistFiles = (files, { commitMessage, newEntry: updateFile }) =>
    Promise.all(files.map(file => this.uploadAndCommit(file, { commitMessage, updateFile })));

  deleteFile = (path, commit_message, options = {}) => {
    const branch = options.branch || this.branch;
    return flow([
      unsentRequest.fromURL,
      unsentRequest.withMethod("DELETE"),
      unsentRequest.withParams({ commit_message, branch }),
      this.requestJSON,
    ])(`${ this.repoURL }/repository/files/${ encodeURIComponent(path) }`);
  }

  persistFiles(files, options) {
    const uploadOpts = {
      commitMessage: options.commitMessage,
      updateFile: (options.newEntry === false) || false,
    };

    const uploads = files.map(file => this.uploadAndCommit(file, uploadOpts));
    return Promise.all(uploads);
  }

  deleteFile(path, commit_message, options = {}) {
    const branch = options.branch || this.branch;
    return this.request(`${this.repoURL}/repository/files/${encodeURIComponent(path)}`, {
      method: "DELETE",
      params: { commit_message, branch },
    }).then(({ data }) => data);
  }
}
