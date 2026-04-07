"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/auth/login";
exports.ids = ["pages/api/auth/login"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ }),

/***/ "iron-session/next":
/*!************************************!*\
  !*** external "iron-session/next" ***!
  \************************************/
/***/ ((module) => {

module.exports = import("iron-session/next");;

/***/ }),

/***/ "(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2Flogin&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Cauth%5Clogin.js&middlewareConfigBase64=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2Flogin&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Cauth%5Clogin.js&middlewareConfigBase64=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/pages-api/module.compiled */ \"(api)/./node_modules/next/dist/server/future/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(api)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _pages_api_auth_login_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages\\api\\auth\\login.js */ \"(api)/./pages/api/auth/login.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_pages_api_auth_login_js__WEBPACK_IMPORTED_MODULE_3__]);\n_pages_api_auth_login_js__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_auth_login_js__WEBPACK_IMPORTED_MODULE_3__, \"default\"));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_auth_login_js__WEBPACK_IMPORTED_MODULE_3__, \"config\");\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/auth/login\",\n        pathname: \"/api/auth/login\",\n        // The following aren't used in production.\n        bundlePath: \"\",\n        filename: \"\"\n    },\n    userland: _pages_api_auth_login_js__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LXJvdXRlLWxvYWRlci9pbmRleC5qcz9raW5kPVBBR0VTX0FQSSZwYWdlPSUyRmFwaSUyRmF1dGglMkZsb2dpbiZwcmVmZXJyZWRSZWdpb249JmFic29sdXRlUGFnZVBhdGg9LiUyRnBhZ2VzJTVDYXBpJTVDYXV0aCU1Q2xvZ2luLmpzJm1pZGRsZXdhcmVDb25maWdCYXNlNjQ9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNMO0FBQzFEO0FBQ3lEO0FBQ3pEO0FBQ0EsaUVBQWUsd0VBQUssQ0FBQyxxREFBUSxZQUFZLEVBQUM7QUFDMUM7QUFDTyxlQUFlLHdFQUFLLENBQUMscURBQVE7QUFDcEM7QUFDTyx3QkFBd0IsZ0hBQW1CO0FBQ2xEO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFlBQVk7QUFDWixDQUFDOztBQUVELHFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZXgtY29udmljdC1yZWludGVncmF0aW9uLXBsYXRmb3JtLz83NzRjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2VzQVBJUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9wYWdlcy1hcGkvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgaG9pc3QgfSBmcm9tIFwibmV4dC9kaXN0L2J1aWxkL3RlbXBsYXRlcy9oZWxwZXJzXCI7XG4vLyBJbXBvcnQgdGhlIHVzZXJsYW5kIGNvZGUuXG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiLi9wYWdlc1xcXFxhcGlcXFxcYXV0aFxcXFxsb2dpbi5qc1wiO1xuLy8gUmUtZXhwb3J0IHRoZSBoYW5kbGVyIChzaG91bGQgYmUgdGhlIGRlZmF1bHQgZXhwb3J0KS5cbmV4cG9ydCBkZWZhdWx0IGhvaXN0KHVzZXJsYW5kLCBcImRlZmF1bHRcIik7XG4vLyBSZS1leHBvcnQgY29uZmlnLlxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IGhvaXN0KHVzZXJsYW5kLCBcImNvbmZpZ1wiKTtcbi8vIENyZWF0ZSBhbmQgZXhwb3J0IHRoZSByb3V0ZSBtb2R1bGUgdGhhdCB3aWxsIGJlIGNvbnN1bWVkLlxuZXhwb3J0IGNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IFBhZ2VzQVBJUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLlBBR0VTX0FQSSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvbG9naW5cIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL2xvZ2luXCIsXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgYXJlbid0IHVzZWQgaW4gcHJvZHVjdGlvbi5cbiAgICAgICAgYnVuZGxlUGF0aDogXCJcIixcbiAgICAgICAgZmlsZW5hbWU6IFwiXCJcbiAgICB9LFxuICAgIHVzZXJsYW5kXG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFnZXMtYXBpLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2Flogin&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Cauth%5Clogin.js&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api)/./lib/prisma.js":
/*!***********************!*\
  !*** ./lib/prisma.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nlet prisma;\nif (false) {} else {\n    // Prevent multiple instances during hot reload in development\n    if (!global.prisma) {\n        global.prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\n    }\n    prisma = global.prisma;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9saWIvcHJpc21hLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE2QztBQUU3QyxJQUFJQztBQUVKLElBQUlDLEtBQXlCLEVBQWMsRUFFMUMsTUFBTTtJQUNMLDhEQUE4RDtJQUM5RCxJQUFJLENBQUNDLE9BQU9GLE1BQU0sRUFBRTtRQUNsQkUsT0FBT0YsTUFBTSxHQUFHLElBQUlELHdEQUFZQTtJQUNsQztJQUNBQyxTQUFTRSxPQUFPRixNQUFNO0FBQ3hCO0FBRUEsaUVBQWVBLE1BQU1BLEVBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leC1jb252aWN0LXJlaW50ZWdyYXRpb24tcGxhdGZvcm0vLi9saWIvcHJpc21hLmpzPzc1MTUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXHJcblxyXG5sZXQgcHJpc21hXHJcblxyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xyXG4gIHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKVxyXG59IGVsc2Uge1xyXG4gIC8vIFByZXZlbnQgbXVsdGlwbGUgaW5zdGFuY2VzIGR1cmluZyBob3QgcmVsb2FkIGluIGRldmVsb3BtZW50XHJcbiAgaWYgKCFnbG9iYWwucHJpc21hKSB7XHJcbiAgICBnbG9iYWwucHJpc21hID0gbmV3IFByaXNtYUNsaWVudCgpXHJcbiAgfVxyXG4gIHByaXNtYSA9IGdsb2JhbC5wcmlzbWFcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJpc21hXHJcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJwcm9jZXNzIiwiZ2xvYmFsIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./lib/prisma.js\n");

/***/ }),

/***/ "(api)/./pages/api/auth/login.js":
/*!*********************************!*\
  !*** ./pages/api/auth/login.js ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/prisma */ \"(api)/./lib/prisma.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var iron_session_next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! iron-session/next */ \"iron-session/next\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([iron_session_next__WEBPACK_IMPORTED_MODULE_2__]);\niron_session_next__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nconst sessionOptions = {\n    password: process.env.SESSION_PASSWORD || \"devpassworddevpassworddevpass\",\n    cookieName: \"exconvict_session\",\n    cookieOptions: {\n        secure: \"development\" === \"production\"\n    }\n};\nasync function handler(req, res) {\n    if (req.method !== \"POST\") return res.status(405).end();\n    const { email, password } = req.body;\n    if (!email || !password) return res.status(400).json({\n        message: \"Missing email or password\"\n    });\n    try {\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__[\"default\"].user.findUnique({\n            where: {\n                email\n            }\n        });\n        if (!user) return res.status(401).json({\n            message: \"Invalid credentials\"\n        });\n        const ok = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(password, user.password);\n        if (!ok) return res.status(401).json({\n            message: \"Invalid credentials\"\n        });\n        // set session\n        req.session.user = {\n            id: user.id,\n            email: user.email,\n            name: user.name,\n            role: user.role\n        };\n        await req.session.save();\n        return res.json({\n            user: req.session.user\n        });\n    } catch (err) {\n        console.error(err);\n        return res.status(500).json({\n            message: \"Server error\"\n        });\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,iron_session_next__WEBPACK_IMPORTED_MODULE_2__.withIronSessionApiRoute)(handler, sessionOptions));\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXV0aC9sb2dpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUF3QztBQUNYO0FBQzhCO0FBRTNELE1BQU1HLGlCQUFpQjtJQUNyQkMsVUFBVUMsUUFBUUMsR0FBRyxDQUFDQyxnQkFBZ0IsSUFBSTtJQUMxQ0MsWUFBWTtJQUNaQyxlQUFlO1FBQUVDLFFBQVFMLGtCQUF5QjtJQUFhO0FBQ2pFO0FBRUEsZUFBZU0sUUFBUUMsR0FBRyxFQUFFQyxHQUFHO0lBQzdCLElBQUlELElBQUlFLE1BQU0sS0FBSyxRQUFRLE9BQU9ELElBQUlFLE1BQU0sQ0FBQyxLQUFLQyxHQUFHO0lBQ3JELE1BQU0sRUFBRUMsS0FBSyxFQUFFYixRQUFRLEVBQUUsR0FBR1EsSUFBSU0sSUFBSTtJQUNwQyxJQUFJLENBQUNELFNBQVMsQ0FBQ2IsVUFBVSxPQUFPUyxJQUFJRSxNQUFNLENBQUMsS0FBS0ksSUFBSSxDQUFDO1FBQUVDLFNBQVM7SUFBNEI7SUFFNUYsSUFBSTtRQUNGLE1BQU1DLE9BQU8sTUFBTXJCLHdEQUFXLENBQUNzQixVQUFVLENBQUM7WUFBRUMsT0FBTztnQkFBRU47WUFBTTtRQUFFO1FBQzdELElBQUksQ0FBQ0ksTUFBTSxPQUFPUixJQUFJRSxNQUFNLENBQUMsS0FBS0ksSUFBSSxDQUFDO1lBQUVDLFNBQVM7UUFBc0I7UUFDeEUsTUFBTUksS0FBSyxNQUFNdkIsdURBQWMsQ0FBQ0csVUFBVWlCLEtBQUtqQixRQUFRO1FBQ3ZELElBQUksQ0FBQ29CLElBQUksT0FBT1gsSUFBSUUsTUFBTSxDQUFDLEtBQUtJLElBQUksQ0FBQztZQUFFQyxTQUFTO1FBQXNCO1FBRXRFLGNBQWM7UUFDZFIsSUFBSWMsT0FBTyxDQUFDTCxJQUFJLEdBQUc7WUFBRU0sSUFBSU4sS0FBS00sRUFBRTtZQUFFVixPQUFPSSxLQUFLSixLQUFLO1lBQUVXLE1BQU1QLEtBQUtPLElBQUk7WUFBRUMsTUFBTVIsS0FBS1EsSUFBSTtRQUFDO1FBQ3RGLE1BQU1qQixJQUFJYyxPQUFPLENBQUNJLElBQUk7UUFDdEIsT0FBT2pCLElBQUlNLElBQUksQ0FBQztZQUFFRSxNQUFNVCxJQUFJYyxPQUFPLENBQUNMLElBQUk7UUFBQztJQUMzQyxFQUFFLE9BQU9VLEtBQUs7UUFDWkMsUUFBUUMsS0FBSyxDQUFDRjtRQUNkLE9BQU9sQixJQUFJRSxNQUFNLENBQUMsS0FBS0ksSUFBSSxDQUFDO1lBQUVDLFNBQVM7UUFBZTtJQUN4RDtBQUNGO0FBRUEsaUVBQWVsQiwwRUFBdUJBLENBQUNTLFNBQVNSLGVBQWVBLEVBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leC1jb252aWN0LXJlaW50ZWdyYXRpb24tcGxhdGZvcm0vLi9wYWdlcy9hcGkvYXV0aC9sb2dpbi5qcz8xMzE3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwcmlzbWEgZnJvbSAnLi4vLi4vLi4vbGliL3ByaXNtYSdcclxuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcydcclxuaW1wb3J0IHsgd2l0aElyb25TZXNzaW9uQXBpUm91dGUgfSBmcm9tICdpcm9uLXNlc3Npb24vbmV4dCdcclxuXHJcbmNvbnN0IHNlc3Npb25PcHRpb25zID0ge1xyXG4gIHBhc3N3b3JkOiBwcm9jZXNzLmVudi5TRVNTSU9OX1BBU1NXT1JEIHx8ICdkZXZwYXNzd29yZGRldnBhc3N3b3JkZGV2cGFzcycsXHJcbiAgY29va2llTmFtZTogJ2V4Y29udmljdF9zZXNzaW9uJyxcclxuICBjb29raWVPcHRpb25zOiB7IHNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcclxuICBpZiAocmVxLm1ldGhvZCAhPT0gJ1BPU1QnKSByZXR1cm4gcmVzLnN0YXR1cyg0MDUpLmVuZCgpXHJcbiAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQgfSA9IHJlcS5ib2R5XHJcbiAgaWYgKCFlbWFpbCB8fCAhcGFzc3dvcmQpIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6ICdNaXNzaW5nIGVtYWlsIG9yIHBhc3N3b3JkJyB9KVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBlbWFpbCB9IH0pXHJcbiAgICBpZiAoIXVzZXIpIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7IG1lc3NhZ2U6ICdJbnZhbGlkIGNyZWRlbnRpYWxzJyB9KVxyXG4gICAgY29uc3Qgb2sgPSBhd2FpdCBiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgdXNlci5wYXNzd29yZClcclxuICAgIGlmICghb2spIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7IG1lc3NhZ2U6ICdJbnZhbGlkIGNyZWRlbnRpYWxzJyB9KVxyXG5cclxuICAgIC8vIHNldCBzZXNzaW9uXHJcbiAgICByZXEuc2Vzc2lvbi51c2VyID0geyBpZDogdXNlci5pZCwgZW1haWw6IHVzZXIuZW1haWwsIG5hbWU6IHVzZXIubmFtZSwgcm9sZTogdXNlci5yb2xlIH1cclxuICAgIGF3YWl0IHJlcS5zZXNzaW9uLnNhdmUoKVxyXG4gICAgcmV0dXJuIHJlcy5qc29uKHsgdXNlcjogcmVxLnNlc3Npb24udXNlciB9KVxyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgY29uc29sZS5lcnJvcihlcnIpXHJcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiAnU2VydmVyIGVycm9yJyB9KVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgd2l0aElyb25TZXNzaW9uQXBpUm91dGUoaGFuZGxlciwgc2Vzc2lvbk9wdGlvbnMpXHJcbiJdLCJuYW1lcyI6WyJwcmlzbWEiLCJiY3J5cHQiLCJ3aXRoSXJvblNlc3Npb25BcGlSb3V0ZSIsInNlc3Npb25PcHRpb25zIiwicGFzc3dvcmQiLCJwcm9jZXNzIiwiZW52IiwiU0VTU0lPTl9QQVNTV09SRCIsImNvb2tpZU5hbWUiLCJjb29raWVPcHRpb25zIiwic2VjdXJlIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsInN0YXR1cyIsImVuZCIsImVtYWlsIiwiYm9keSIsImpzb24iLCJtZXNzYWdlIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsIm9rIiwiY29tcGFyZSIsInNlc3Npb24iLCJpZCIsIm5hbWUiLCJyb2xlIiwic2F2ZSIsImVyciIsImNvbnNvbGUiLCJlcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/auth/login.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2Flogin&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Cauth%5Clogin.js&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();