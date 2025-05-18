import { useState, useRef, useCallback, useEffect } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function useSmartFetch(url, options = {}) {
    const { cacheKey, retry = 0, refetchOnMount = true, refreshInterval = 0, cacheExpiry, timeout = 5000, deps = [], initialData = null, } = options;
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef(null);
    const fetchData = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        var _a;
        (_a = abortControllerRef.current) === null || _a === void 0 ? void 0 : _a.abort();
        abortControllerRef.current = new AbortController();
        setLoading(true);
        setError(null);
        let attempt = 0;
        let success = false;
        while (attempt <= retry && !success) {
            try {
                const timer = setTimeout(() => { var _a; return (_a = abortControllerRef.current) === null || _a === void 0 ? void 0 : _a.abort(); }, timeout);
                const res = yield fetch(url, {
                    signal: abortControllerRef.current.signal,
                });
                clearTimeout(timer);
                if (!res.ok)
                    throw new Error(`HTTP ${res.status}`);
                const json = yield res.json();
                if (cacheKey) {
                    const cacheData = {
                        data: json,
                        timestamp: Date.now(),
                    };
                    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                }
                setData(json);
                success = true;
            }
            catch (err) {
                attempt++;
                if (attempt > retry) {
                    setError(err);
                }
            }
        }
        setLoading(false);
    }), [url, retry, cacheKey, timeout]);
    // Cache handling with expiry
    useEffect(() => {
        if (cacheKey) {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                const isExpired = cacheExpiry && Date.now() - timestamp > cacheExpiry * 1000;
                if (!isExpired)
                    setData(data);
            }
        }
    }, [cacheKey, cacheExpiry]);
    // Initial fetch and refresh interval
    useEffect(() => {
        if (refetchOnMount)
            fetchData();
        let intervalId;
        if (refreshInterval > 0) {
            intervalId = setInterval(fetchData, refreshInterval);
        }
        return () => {
            var _a;
            (_a = abortControllerRef.current) === null || _a === void 0 ? void 0 : _a.abort();
            clearInterval(intervalId);
        };
    }, [fetchData, refreshInterval, ...deps]);
    return { data, error, loading, refetch: fetchData };
}

export { useSmartFetch };
