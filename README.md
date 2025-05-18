```markdown
# react-smart-fetch-hook 🚀

[![npm version](https://img.shields.io/npm/v/react-smart-fetch-hook.svg)](https://www.npmjs.com/package/react-smart-fetch-hook)
[![npm downloads](https://img.shields.io/npm/dm/react-smart-fetch-hook.svg)](https://www.npmjs.com/package/react-smart-fetch-hook)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-smart-fetch-hook)](https://bundlephobia.com/package/react-smart-fetch-hook)
[![license](https://img.shields.io/npm/l/react-smart-fetch-hook.svg)](https://github.com/yourusername/react-smart-fetch-hook/blob/main/LICENSE)

A smart, lightweight React hook for data fetching with built-in caching, retries, timeouts, and refresh logic. Perfect for modern React applications that need resilient data fetching.

## ✨ Features

- **🔄 Automatic Retries** - Configurable retry logic for failed requests
- **💾 Smart Caching** - localStorage-based caching with expiry
- **⏱️ Request Timeouts** - Prevent hanging requests
- **🔄 Auto Refresh** - Polling/refetching at intervals
- **🚫 Request Cancellation** - AbortController support
- **📦 Tiny Size** - Less than 3kB gzipped
- **🛠 TypeScript Ready** - Full type definitions included
- **⚛️ React 16.8+ Compatible** - Works with all modern React versions

## 📦 Installation

```bash
npm install react-smart-fetch-hook
# or
yarn add react-smart-fetch-hook
```

## 🚀 Basic Usage

```jsx
import { useSmartFetch } from 'react-smart-fetch-hook';

function UserProfile({ userId }) {
  const { data, error, loading, refetch } = useSmartFetch(
    `https://api.example.com/users/${userId}`,
    {
      cacheKey: `user-${userId}`,
      retry: 2,
      timeout: 5000
    }
  );

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={refetch}>Reload Data</button>
    </div>
  );
}
```

## 🔧 API Reference

### `useSmartFetch(url: string, options?: Options)`

#### Options

| Option            | Type       | Default   | Description |
|-------------------|------------|-----------|-------------|
| `cacheKey`        | `string`   | `undefined` | Unique key for localStorage caching |
| `retry`           | `number`   | `0`       | Number of retry attempts on failure |
| `refetchOnMount`  | `boolean`  | `true`    | Fetch data when component mounts |
| `refreshInterval` | `number`   | `0`       | Auto-refetch interval in milliseconds |
| `cacheExpiry`     | `number`   | `undefined` | Cache expiration time in seconds |
| `timeout`         | `number`   | `5000`    | Request timeout in milliseconds |
| `deps`           | `any[]`    | `[]`      | Dependencies that trigger refetch when changed |
| `initialData`     | `any`      | `null`    | Initial data before first fetch |

#### Return Object

| Property  | Type               | Description |
|-----------|--------------------|-------------|
| `data`    | `T \| null`        | Fetched data (or cached data if available) |
| `error`   | `Error \| null`    | Error object if request fails |
| `loading` | `boolean`          | `true` while request is in progress |
| `refetch` | `() => Promise<void>` | Function to manually trigger refetch |

## 🎯 Advanced Examples

### Auto-Refreshing Data (Polling)

```jsx
const { data } = useSmartFetch('/api/stock-prices', {
  refreshInterval: 10000, // Refetch every 10 seconds
});
```

### Cached Data with Expiration

```jsx
const { data } = useSmartFetch('/api/weather', {
  cacheKey: 'weather-data',
  cacheExpiry: 3600, // 1 hour expiration
});
```

### Dependent Fetching

```jsx
const { data } = useSmartFetch(`/api/user/${userId}/posts`, {
  deps: [userId], // Refetches when userId changes
});
```

### Error Recovery with Retries

```jsx
const { data, error } = useSmartFetch('/api/unstable-endpoint', {
  retry: 3, // Will retry 3 times before giving up
  retryDelay: 1000, // Wait 1 second between retries
});
```

## 🤔 FAQ

### How does caching work?
The hook stores responses in localStorage with the provided `cacheKey`. If `cacheExpiry` is set, it will ignore cached data after the expiration time.

### Can I use this with GraphQL?
Yes! Just pass your GraphQL endpoint and handle the request body accordingly. For advanced GraphQL features, consider wrapping the hook.

### How do I handle POST requests?
This hook is designed for GET requests by default. For other methods, consider extending it or using a more specialized solution.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

## 📜 License

MIT © [Abdullah Al Mubin](https://github.com/AmtTawsik)

---
