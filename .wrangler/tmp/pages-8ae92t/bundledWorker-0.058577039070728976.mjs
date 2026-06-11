var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// _worker.js/index.js
import { renderers } from "./renderers.mjs";
import { createExports } from "./_@astrojs-ssr-adapter.mjs";
import { manifest } from "./manifest_K4OREV7u.mjs";
globalThis.process ??= {};
globalThis.process.env ??= {};
var _page0 = /* @__PURE__ */ __name(() => import("./pages/_image.astro.mjs"), "_page0");
var _page1 = /* @__PURE__ */ __name(() => import("./pages/404.astro.mjs"), "_page1");
var _page2 = /* @__PURE__ */ __name(() => import("./pages/about/corrections.astro.mjs"), "_page2");
var _page3 = /* @__PURE__ */ __name(() => import("./pages/about/sources.astro.mjs"), "_page3");
var _page4 = /* @__PURE__ */ __name(() => import("./pages/about.astro.mjs"), "_page4");
var _page5 = /* @__PURE__ */ __name(() => import("./pages/accessibility.astro.mjs"), "_page5");
var _page6 = /* @__PURE__ */ __name(() => import("./pages/adaptive/_slug_.astro.mjs"), "_page6");
var _page7 = /* @__PURE__ */ __name(() => import("./pages/adaptive.astro.mjs"), "_page7");
var _page8 = /* @__PURE__ */ __name(() => import("./pages/admin/api/camps/_id_/reject.astro.mjs"), "_page8");
var _page9 = /* @__PURE__ */ __name(() => import("./pages/admin/api/camps/_id_/verify.astro.mjs"), "_page9");
var _page10 = /* @__PURE__ */ __name(() => import("./pages/admin/camps/queue.astro.mjs"), "_page10");
var _page11 = /* @__PURE__ */ __name(() => import("./pages/admin/camps/spot-check.astro.mjs"), "_page11");
var _page12 = /* @__PURE__ */ __name(() => import("./pages/admin/camps/_id_.astro.mjs"), "_page12");
var _page13 = /* @__PURE__ */ __name(() => import("./pages/admin/camps.astro.mjs"), "_page13");
var _page14 = /* @__PURE__ */ __name(() => import("./pages/admin/claims.astro.mjs"), "_page14");
var _page15 = /* @__PURE__ */ __name(() => import("./pages/admin/editorial.astro.mjs"), "_page15");
var _page16 = /* @__PURE__ */ __name(() => import("./pages/admin/image-needs.astro.mjs"), "_page16");
var _page17 = /* @__PURE__ */ __name(() => import("./pages/admin/link-health.astro.mjs"), "_page17");
var _page18 = /* @__PURE__ */ __name(() => import("./pages/admin/preview/_collection_/_slug_.astro.mjs"), "_page18");
var _page19 = /* @__PURE__ */ __name(() => import("./pages/admin/reviews.astro.mjs"), "_page19");
var _page20 = /* @__PURE__ */ __name(() => import("./pages/admin/source-quality.astro.mjs"), "_page20");
var _page21 = /* @__PURE__ */ __name(() => import("./pages/ages/_group_.astro.mjs"), "_page21");
var _page22 = /* @__PURE__ */ __name(() => import("./pages/ages.astro.mjs"), "_page22");
var _page23 = /* @__PURE__ */ __name(() => import("./pages/api/admin/camps/_id_/approve.astro.mjs"), "_page23");
var _page24 = /* @__PURE__ */ __name(() => import("./pages/api/admin/camps/_id_/photo.astro.mjs"), "_page24");
var _page25 = /* @__PURE__ */ __name(() => import("./pages/api/admin/camps/_id_/reject.astro.mjs"), "_page25");
var _page26 = /* @__PURE__ */ __name(() => import("./pages/api/admin/camps/_id_/update.astro.mjs"), "_page26");
var _page27 = /* @__PURE__ */ __name(() => import("./pages/api/admin/camps/_id_/verify.astro.mjs"), "_page27");
var _page28 = /* @__PURE__ */ __name(() => import("./pages/api/admin/claims/_id_/update.astro.mjs"), "_page28");
var _page29 = /* @__PURE__ */ __name(() => import("./pages/api/admin/editorial/approve.astro.mjs"), "_page29");
var _page30 = /* @__PURE__ */ __name(() => import("./pages/api/admin/reviews/_id_/approve.astro.mjs"), "_page30");
var _page31 = /* @__PURE__ */ __name(() => import("./pages/api/admin/reviews/_id_/reject.astro.mjs"), "_page31");
var _page32 = /* @__PURE__ */ __name(() => import("./pages/api/camps/check.astro.mjs"), "_page32");
var _page33 = /* @__PURE__ */ __name(() => import("./pages/api/camps/nearest.astro.mjs"), "_page33");
var _page34 = /* @__PURE__ */ __name(() => import("./pages/api/camps/search-priority.astro.mjs"), "_page34");
var _page35 = /* @__PURE__ */ __name(() => import("./pages/api/camps/submit.astro.mjs"), "_page35");
var _page36 = /* @__PURE__ */ __name(() => import("./pages/api/camps/_slug_/claim.astro.mjs"), "_page36");
var _page37 = /* @__PURE__ */ __name(() => import("./pages/api/camps/_slug_/reviews/submit.astro.mjs"), "_page37");
var _page38 = /* @__PURE__ */ __name(() => import("./pages/api/cron/camps-sweep.astro.mjs"), "_page38");
var _page39 = /* @__PURE__ */ __name(() => import("./pages/body/_slug_.astro.mjs"), "_page39");
var _page40 = /* @__PURE__ */ __name(() => import("./pages/body.astro.mjs"), "_page40");
var _page41 = /* @__PURE__ */ __name(() => import("./pages/camp-photos/_---key_.astro.mjs"), "_page41");
var _page42 = /* @__PURE__ */ __name(() => import("./pages/camps/submit.astro.mjs"), "_page42");
var _page43 = /* @__PURE__ */ __name(() => import("./pages/camps/_state_/_city_/_sport_.astro.mjs"), "_page43");
var _page44 = /* @__PURE__ */ __name(() => import("./pages/camps/_state_/_city_.astro.mjs"), "_page44");
var _page45 = /* @__PURE__ */ __name(() => import("./pages/camps/_slug_.astro.mjs"), "_page45");
var _page46 = /* @__PURE__ */ __name(() => import("./pages/camps/_state_.astro.mjs"), "_page46");
var _page47 = /* @__PURE__ */ __name(() => import("./pages/camps.astro.mjs"), "_page47");
var _page48 = /* @__PURE__ */ __name(() => import("./pages/coaching-tips/_slug_.astro.mjs"), "_page48");
var _page49 = /* @__PURE__ */ __name(() => import("./pages/coaching-tips.astro.mjs"), "_page49");
var _page50 = /* @__PURE__ */ __name(() => import("./pages/contributors.astro.mjs"), "_page50");
var _page51 = /* @__PURE__ */ __name(() => import("./pages/cost-calculator/methodology.astro.mjs"), "_page51");
var _page52 = /* @__PURE__ */ __name(() => import("./pages/cost-calculator.astro.mjs"), "_page52");
var _page53 = /* @__PURE__ */ __name(() => import("./pages/decisions/_slug_.astro.mjs"), "_page53");
var _page54 = /* @__PURE__ */ __name(() => import("./pages/decisions.astro.mjs"), "_page54");
var _page55 = /* @__PURE__ */ __name(() => import("./pages/disclosure.astro.mjs"), "_page55");
var _page56 = /* @__PURE__ */ __name(() => import("./pages/drive-home/_slug_.astro.mjs"), "_page56");
var _page57 = /* @__PURE__ */ __name(() => import("./pages/drive-home.astro.mjs"), "_page57");
var _page58 = /* @__PURE__ */ __name(() => import("./pages/drive-there/_slug_.astro.mjs"), "_page58");
var _page59 = /* @__PURE__ */ __name(() => import("./pages/drive-there.astro.mjs"), "_page59");
var _page60 = /* @__PURE__ */ __name(() => import("./pages/game/_slug_.astro.mjs"), "_page60");
var _page61 = /* @__PURE__ */ __name(() => import("./pages/game.astro.mjs"), "_page61");
var _page62 = /* @__PURE__ */ __name(() => import("./pages/go/_slug_.astro.mjs"), "_page62");
var _page63 = /* @__PURE__ */ __name(() => import("./pages/governing-bodies.astro.mjs"), "_page63");
var _page64 = /* @__PURE__ */ __name(() => import("./pages/mental-skills.astro.mjs"), "_page64");
var _page65 = /* @__PURE__ */ __name(() => import("./pages/news/_slug_.astro.mjs"), "_page65");
var _page66 = /* @__PURE__ */ __name(() => import("./pages/news.astro.mjs"), "_page66");
var _page67 = /* @__PURE__ */ __name(() => import("./pages/newsletter.astro.mjs"), "_page67");
var _page68 = /* @__PURE__ */ __name(() => import("./pages/parent-coach.astro.mjs"), "_page68");
var _page69 = /* @__PURE__ */ __name(() => import("./pages/pathways/_sport_.astro.mjs"), "_page69");
var _page70 = /* @__PURE__ */ __name(() => import("./pages/pathways.astro.mjs"), "_page70");
var _page71 = /* @__PURE__ */ __name(() => import("./pages/reads/_topic_.astro.mjs"), "_page71");
var _page72 = /* @__PURE__ */ __name(() => import("./pages/reads.astro.mjs"), "_page72");
var _page73 = /* @__PURE__ */ __name(() => import("./pages/recruiting/_slug_.astro.mjs"), "_page73");
var _page74 = /* @__PURE__ */ __name(() => import("./pages/recruiting.astro.mjs"), "_page74");
var _page75 = /* @__PURE__ */ __name(() => import("./pages/resources/national-organizations.astro.mjs"), "_page75");
var _page76 = /* @__PURE__ */ __name(() => import("./pages/resources/practice-plan-template.astro.mjs"), "_page76");
var _page77 = /* @__PURE__ */ __name(() => import("./pages/resources/what-to-say-when.astro.mjs"), "_page77");
var _page78 = /* @__PURE__ */ __name(() => import("./pages/resources.astro.mjs"), "_page78");
var _page79 = /* @__PURE__ */ __name(() => import("./pages/rss.xml.astro.mjs"), "_page79");
var _page80 = /* @__PURE__ */ __name(() => import("./pages/rules/_sport_.astro.mjs"), "_page80");
var _page81 = /* @__PURE__ */ __name(() => import("./pages/rules.astro.mjs"), "_page81");
var _page82 = /* @__PURE__ */ __name(() => import("./pages/scripts/_slug_.astro.mjs"), "_page82");
var _page83 = /* @__PURE__ */ __name(() => import("./pages/scripts.astro.mjs"), "_page83");
var _page84 = /* @__PURE__ */ __name(() => import("./pages/search.astro.mjs"), "_page84");
var _page85 = /* @__PURE__ */ __name(() => import("./pages/season-calendar/_slug_.astro.mjs"), "_page85");
var _page86 = /* @__PURE__ */ __name(() => import("./pages/season-calendar.astro.mjs"), "_page86");
var _page87 = /* @__PURE__ */ __name(() => import("./pages/sitemap.xml.astro.mjs"), "_page87");
var _page88 = /* @__PURE__ */ __name(() => import("./pages/sports/_slug_.astro.mjs"), "_page88");
var _page89 = /* @__PURE__ */ __name(() => import("./pages/sports.astro.mjs"), "_page89");
var _page90 = /* @__PURE__ */ __name(() => import("./pages/start-here.astro.mjs"), "_page90");
var _page91 = /* @__PURE__ */ __name(() => import("./pages/team-parent/_slug_.astro.mjs"), "_page91");
var _page92 = /* @__PURE__ */ __name(() => import("./pages/team-parent/_topic_.astro.mjs"), "_page92");
var _page93 = /* @__PURE__ */ __name(() => import("./pages/team-parent.astro.mjs"), "_page93");
var _page94 = /* @__PURE__ */ __name(() => import("./pages/terms.astro.mjs"), "_page94");
var _page95 = /* @__PURE__ */ __name(() => import("./pages/tools.astro.mjs"), "_page95");
var _page96 = /* @__PURE__ */ __name(() => import("./pages/welcome.astro.mjs"), "_page96");
var _page97 = /* @__PURE__ */ __name(() => import("./pages/what-to-buy/_slug_/sizing.astro.mjs"), "_page97");
var _page98 = /* @__PURE__ */ __name(() => import("./pages/what-to-buy/_slug_.astro.mjs"), "_page98");
var _page99 = /* @__PURE__ */ __name(() => import("./pages/what-to-buy.astro.mjs"), "_page99");
var _page100 = /* @__PURE__ */ __name(() => import("./pages/why-we-exist.astro.mjs"), "_page100");
var _page101 = /* @__PURE__ */ __name(() => import("./pages/youth-sports-pendulum.astro.mjs"), "_page101");
var _page102 = /* @__PURE__ */ __name(() => import("./pages/index.astro.mjs"), "_page102");
var pageMap = /* @__PURE__ */ new Map([
  ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
  ["src/pages/404.astro", _page1],
  ["src/pages/about/corrections.astro", _page2],
  ["src/pages/about/sources.astro", _page3],
  ["src/pages/about.astro", _page4],
  ["src/pages/accessibility.astro", _page5],
  ["src/pages/adaptive/[slug].astro", _page6],
  ["src/pages/adaptive/index.astro", _page7],
  ["src/pages/admin/api/camps/[id]/reject.ts", _page8],
  ["src/pages/admin/api/camps/[id]/verify.ts", _page9],
  ["src/pages/admin/camps/queue.astro", _page10],
  ["src/pages/admin/camps/spot-check.astro", _page11],
  ["src/pages/admin/camps/[id].astro", _page12],
  ["src/pages/admin/camps/index.astro", _page13],
  ["src/pages/admin/claims/index.astro", _page14],
  ["src/pages/admin/editorial/index.astro", _page15],
  ["src/pages/admin/image-needs.md", _page16],
  ["src/pages/admin/link-health/index.astro", _page17],
  ["src/pages/admin/preview/[collection]/[slug].astro", _page18],
  ["src/pages/admin/reviews/index.astro", _page19],
  ["src/pages/admin/source-quality.astro", _page20],
  ["src/pages/ages/[group].astro", _page21],
  ["src/pages/ages/index.astro", _page22],
  ["src/pages/api/admin/camps/[id]/approve.ts", _page23],
  ["src/pages/api/admin/camps/[id]/photo.ts", _page24],
  ["src/pages/api/admin/camps/[id]/reject.ts", _page25],
  ["src/pages/api/admin/camps/[id]/update.ts", _page26],
  ["src/pages/api/admin/camps/[id]/verify.ts", _page27],
  ["src/pages/api/admin/claims/[id]/update.ts", _page28],
  ["src/pages/api/admin/editorial/approve.ts", _page29],
  ["src/pages/api/admin/reviews/[id]/approve.ts", _page30],
  ["src/pages/api/admin/reviews/[id]/reject.ts", _page31],
  ["src/pages/api/camps/check.ts", _page32],
  ["src/pages/api/camps/nearest.ts", _page33],
  ["src/pages/api/camps/search-priority.ts", _page34],
  ["src/pages/api/camps/submit.ts", _page35],
  ["src/pages/api/camps/[slug]/claim.ts", _page36],
  ["src/pages/api/camps/[slug]/reviews/submit.ts", _page37],
  ["src/pages/api/cron/camps-sweep.ts", _page38],
  ["src/pages/body/[slug].astro", _page39],
  ["src/pages/body/index.astro", _page40],
  ["src/pages/camp-photos/[...key].ts", _page41],
  ["src/pages/camps/submit.astro", _page42],
  ["src/pages/camps/[state]/[city]/[sport]/index.astro", _page43],
  ["src/pages/camps/[state]/[city]/index.astro", _page44],
  ["src/pages/camps/[slug].astro", _page45],
  ["src/pages/camps/[state]/index.astro", _page46],
  ["src/pages/camps/index.astro", _page47],
  ["src/pages/coaching-tips/[slug].astro", _page48],
  ["src/pages/coaching-tips/index.astro", _page49],
  ["src/pages/contributors.astro", _page50],
  ["src/pages/cost-calculator/methodology.astro", _page51],
  ["src/pages/cost-calculator.astro", _page52],
  ["src/pages/decisions/[slug].astro", _page53],
  ["src/pages/decisions/index.astro", _page54],
  ["src/pages/disclosure.astro", _page55],
  ["src/pages/drive-home/[slug].astro", _page56],
  ["src/pages/drive-home/index.astro", _page57],
  ["src/pages/drive-there/[slug].astro", _page58],
  ["src/pages/drive-there/index.astro", _page59],
  ["src/pages/game/[slug].astro", _page60],
  ["src/pages/game/index.astro", _page61],
  ["src/pages/go/[slug].astro", _page62],
  ["src/pages/governing-bodies.astro", _page63],
  ["src/pages/mental-skills.astro", _page64],
  ["src/pages/news/[slug].astro", _page65],
  ["src/pages/news/index.astro", _page66],
  ["src/pages/newsletter.astro", _page67],
  ["src/pages/parent-coach.astro", _page68],
  ["src/pages/pathways/[sport].astro", _page69],
  ["src/pages/pathways/index.astro", _page70],
  ["src/pages/reads/[topic].astro", _page71],
  ["src/pages/reads/index.astro", _page72],
  ["src/pages/recruiting/[slug].astro", _page73],
  ["src/pages/recruiting/index.astro", _page74],
  ["src/pages/resources/national-organizations.astro", _page75],
  ["src/pages/resources/practice-plan-template.astro", _page76],
  ["src/pages/resources/what-to-say-when.astro", _page77],
  ["src/pages/resources/index.astro", _page78],
  ["src/pages/rss.xml.ts", _page79],
  ["src/pages/rules/[sport].astro", _page80],
  ["src/pages/rules/index.astro", _page81],
  ["src/pages/scripts/[slug].astro", _page82],
  ["src/pages/scripts/index.astro", _page83],
  ["src/pages/search.astro", _page84],
  ["src/pages/season-calendar/[slug].astro", _page85],
  ["src/pages/season-calendar/index.astro", _page86],
  ["src/pages/sitemap.xml.ts", _page87],
  ["src/pages/sports/[slug].astro", _page88],
  ["src/pages/sports/index.astro", _page89],
  ["src/pages/start-here.astro", _page90],
  ["src/pages/team-parent/[slug].astro", _page91],
  ["src/pages/team-parent/[topic].astro", _page92],
  ["src/pages/team-parent/index.astro", _page93],
  ["src/pages/terms.astro", _page94],
  ["src/pages/tools/index.astro", _page95],
  ["src/pages/welcome/index.astro", _page96],
  ["src/pages/what-to-buy/[slug]/sizing.astro", _page97],
  ["src/pages/what-to-buy/[slug].astro", _page98],
  ["src/pages/what-to-buy/index.astro", _page99],
  ["src/pages/why-we-exist.astro", _page100],
  ["src/pages/youth-sports-pendulum.astro", _page101],
  ["src/pages/index.astro", _page102]
]);
var serverIslandMap = /* @__PURE__ */ new Map();
var _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  middleware: /* @__PURE__ */ __name(() => import("./_astro-internal_middleware.mjs"), "middleware")
});
var _exports = createExports(_manifest);
var __astrojsSsrVirtualEntry = _exports.default;
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
//# sourceMappingURL=bundledWorker-0.058577039070728976.mjs.map
