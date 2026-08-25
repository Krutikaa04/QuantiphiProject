/**
 * Uniform JSON response envelope so every endpoint returns a predictable shape.
 * { success: boolean, data?: any, error?: string }
 */

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {*} data - payload to return
 * @param {number} [status=200]
 */
export function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

/**
 * Send a failure response.
 * @param {import('express').Response} res
 * @param {string} message - human-readable error message
 * @param {number} [status=400]
 */
export function failure(res, message, status = 400) {
  return res.status(status).json({ success: false, error: message });
}
