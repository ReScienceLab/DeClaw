function parsePort(value: string | undefined, defaultPort: number): number {
  if (!value) return defaultPort

  const port = Number.parseInt(value, 10)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return defaultPort
  }

  return port
}

export function parseDirectPeerAddress(input: string, defaultPort: number): { address: string; port: number } {
  const value = input.trim()

  if (value.startsWith("http://") || value.startsWith("https://")) {
    const url = new URL(value)
    return {
      address: url.hostname,
      port: parsePort(url.port, defaultPort),
    }
  }

  const bracketedIpv6 = value.match(/^\[([^\]]+)\](?::([^:]+))?$/)
  if (bracketedIpv6) {
    return {
      address: bracketedIpv6[1],
      port: parsePort(bracketedIpv6[2], defaultPort),
    }
  }

  const colonCount = [...value].filter(ch => ch === ":").length
  if (colonCount === 1) {
    const [address, maybePort] = value.split(":")
    if (/^\d+$/.test(maybePort)) {
      return {
        address,
        port: parsePort(maybePort, defaultPort),
      }
    }
  }

  return {
    address: value,
    port: defaultPort,
  }
}
