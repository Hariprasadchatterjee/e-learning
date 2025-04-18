export function isValidToken(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

