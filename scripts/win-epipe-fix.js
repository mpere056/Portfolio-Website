// Guard against EPIPE on Windows/Node 22 by swallowing broken pipe writes
// and avoiding process crash on uncaughtException with code 'EPIPE'.
/* eslint-disable no-console */

function isEpipe(err) {
  return err && (err.code === 'EPIPE' || /EPIPE/.test(String(err)))
}

try {
  if (process.stdout && typeof process.stdout.on === 'function') {
    process.stdout.on('error', err => {
      if (isEpipe(err)) return
      throw err
    })
  }
} catch {}

try {
  if (process.stderr && typeof process.stderr.on === 'function') {
    process.stderr.on('error', err => {
      if (isEpipe(err)) return
      throw err
    })
  }
} catch {}

// Wrap console methods defensively
for (const key of ['log', 'info', 'warn', 'error']) {
  const orig = console[key]
  console[key] = (...args) => {
    try {
      return orig.apply(console, args)
    } catch (err) {
      if (isEpipe(err)) return
      throw err
    }
  }
}

process.on('uncaughtException', err => {
  if (isEpipe(err)) {
    // Swallow EPIPE to keep dev/build alive
    return
  }
  // Re-throw others to preserve normal crash semantics
  throw err
})


