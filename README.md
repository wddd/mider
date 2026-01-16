# Mider

Mider is a JavaScript library that provides a centralized interface management system and a collection of utility functions for interacting with servers. It simplifies API calls by offering features like mixins for configuration reuse, request queuing, response caching, and more.

## Packages

This repository contains the following packages:

*   **@mider/interface-proxy:** A powerful tool for managing and centralizing API calls.
*   **@mider/file-uploader:** A flexible component for handling file uploads.
*   **@mider/utils:** A collection of utility functions for everyday development tasks.

## @mider/interface-proxy

### Description

The `InterfaceProxy` class allows you to manage all your API endpoints in a single, organized configuration. It provides a clean and consistent way to make API calls, with support for features like:

*   **Mixins:** Reuse common configurations across multiple API endpoints.
*   **Request Queuing:** Automatically queue requests to the same endpoint.
*   **Request Merging:** Merge multiple identical requests into a single one.
*   **Caching:** Cache responses to avoid redundant API calls.
*   **Promise-based API:** A modern, Promise-based interface for handling asynchronous operations.

### Basic Usage

```javascript
import { InterfaceProxy } from 'mider';

const iProxy = new InterfaceProxy({
  user: {
    url: '/user',
    params: {
      id: String,
      name: String,
    },
  },
  vip: {
    mixins: 'user',
    params: {
      id: String,
      name: String,
      type: 'vip',
    },
  },
});

// GET /user?id=1
iProxy.user(1).then(data => console.log(data));

// POST /user with a JSON body
iProxy.user.post({ name: 'foo' });

// PUT /user with a JSON body
iProxy.user.put({ id: '1', name: 'bar' });

// DELETE /user?id=1
iProxy.user.delete({ params: { id: '1' } });

// GET /user?id=1&type=vip
iProxy.vip(1);
```

### Default Options

You can apply default options to all API endpoints in an `InterfaceProxy` instance. Individual endpoint configurations will override the default options.

```javascript
import { InterfaceProxy } from 'mider';

const iProxyDelete = new InterfaceProxy({
  user: {
    url: '/user',
  },
  article: {
    url: '/article',
  },
  comment: {
    url: '/comment',
    params: {
      id: String,
      articleId: String,
    }
  }
}, {
  type: 'delete',
  params: { id: String },
});

// DELETE /user?id=1
iProxyDelete.user(1);

// DELETE /article?id=10
iProxyDelete.article(10);

// DELETE /comment?articleId=10
iProxyDelete.comment(null, 10);
```

### Interface Configuration

Here's a complete list of the available configuration options for each API endpoint:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `pathname` | `string` | | The path of the API endpoint. Alias: `url`. |
| `origin` | `string` | `''` | The base domain for the API endpoint. If set, it will be prepended to the `pathname`. |
| `type` | `string` | `'get'` | The request method. Aliases: `method`. Options: `"get"`, `"delete"`, `"head"`, `"option"`, `"post"`, `"put"`, `"patch"`. |
| `dataType` | `string` | `'json'` | The expected data type of the response. Options: `"json"`, `"jsonp"`, `"html"`. |
| `params` | `object` | | The accepted URL query parameters. These will be merged with the parameters provided at the time of the call. |
| `data` | `object` \| `Array` \| `string` \| `number` | | The data to be sent in the request body. |
| `pathParams` | `object` | | The parameters to be used in the URL path. For example, `/api/users/:id` with `pathParams: { id: 123 }` will become `/api/users/123`. |
| `jsonp` | `string` | `'callback'` | The name of the JSONP callback function. This option is only effective when `dataType` is set to `jsonp`. |
| `beforeSend` | `function` | | A hook function that is called before the request is sent. It can be used to set headers, etc. |
| `paramsFilter` | `function` | | A function to filter the parameters before they are sent. |
| `dataPath` | `string` | | The path to extract the data from the response. For example, with `dataPath: 'data.row'`, a response of `{ data: { count: 99, row: [1, 2, 3] }, success: true }` will result in `[1, 2, 3]` being passed to the `then` callback. |
| `dataFilter` | `function` | | A hook function to preprocess the data before it is passed to the `then` callback. |
| `successHandler` | `function` | | A hook function to customize the success/failure logic and data extraction. The function should return an object with the shape `{ success: true|false, data: any }`. |
| `merge` | `boolean` | `false` | If `true`, multiple identical requests to the same endpoint with the same parameters will be merged into a single request. |
| `queue` | `boolean` | `false` | If `true`, all requests to the same endpoint will be queued and their callbacks will be executed in the order the requests were made. |
| `single` | `boolean` | `false` | If `true`, only the last of multiple concurrent requests to the same endpoint will be processed. |
| `mixins` | `string` \| `Array` | | The name(s) of other configurations to mix in. If it's a string, it will mix in the configuration with that name. If it's an array, it will mix in the configurations from right to left. |
| `name` | `string` | | A descriptive name for the API endpoint. |
| `returns` | `*` | | A description of the expected return data. |

## @mider/file-uploader

The `FileUploader` class provides a simple and flexible way to handle file uploads. It supports progress events, file type and size validation, and more.

### Basic Usage

```javascript
import { FileUploader } from 'mider';

const uploader = new FileUploader({
  uploadUrl: '/upload',
  uploadElem: document.getElementById('file-input'),
  imgElem: document.getElementById('preview-image'),
  fileType: 'jpg,png,gif',
  fileSize: '1024', // 1MB
  uploading: (progress) => {
    console.log(`Upload progress: ${progress}%`);
  },
  callback: (response) => {
    console.log('Upload successful:', response);
  },
  errCallback: (error) => {
    console.error('Upload failed:', error);
  },
});

// To trigger the upload, you can either call the `send` method manually,
// or have it called automatically when the file input changes.
document.getElementById('file-input').addEventListener('change', () => {
  uploader.send();
});
```

## @mider/utils

The `utils` package provides a collection of utility functions for common tasks, such as:

*   **Type Checking:** `isString`, `isObject`, `isArray`, etc.
*   **Object Manipulation:** `objClone`, `objCover`, `objEqual`, etc.
*   **URL Manipulation:** `parseURL`, `buildURL`.
*   **DOM Manipulation:** A jQuery-like selector engine and DOM manipulation methods.

### Basic Usage

```javascript
import { $wd } from 'mider';

// DOM manipulation
$wd('.my-element').addClass('active').html('Hello, world!');

// URL manipulation
const url = $wd.parseURL('http://example.com?foo=bar');
console.log(url.params.foo); // => "bar"
```

## Authors

*   wdzxc

```
