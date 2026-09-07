// Media seeking needs a known resource length and byte-range responses.
export function staticFileResponse(content, { range, method = 'GET', contentType }) {
  const headers = {
    'content-type': contentType,
    'access-control-allow-origin': '*',
    'accept-ranges': 'bytes',
    'content-length': content.length,
  };
  const full = () => ({ status: 200, headers, body: method === 'HEAD' ? undefined : content });
  if (method !== 'GET' || !range || !range.startsWith('bytes=')) return full();
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  const invalid = () => ({
    status: 416,
    headers: { ...headers, 'content-length': 0, 'content-range': `bytes */${content.length}` },
    body: undefined,
  });
  if (!match || (!match[1] && !match[2]) || content.length === 0) return invalid();
  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : content.length - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end)) return invalid();
  if (!match[1]) {
    if (end === 0) return invalid();
    start = Math.max(0, content.length - end);
    end = content.length - 1;
  }
  if (start >= content.length || end < start) return invalid();
  end = Math.min(end, content.length - 1);
  return {
    status: 206,
    headers: {
      ...headers,
      'content-length': end - start + 1,
      'content-range': `bytes ${start}-${end}/${content.length}`,
    },
    body: method === 'HEAD' ? undefined : content.subarray(start, end + 1),
  };
}
