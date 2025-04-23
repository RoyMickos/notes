2023-05-12
Tags:

---
# Tracing chrome and chromedriver

Chrome and chromedriver produce separate logs, hence you need to configure them separately. For chrome, this is controlled using
ChromeOptions:
```typescript
      const options = new ChromeOptions().windowSize(windowSize).setChromeLogFile("/tmp/chrome.log");
```

For the chromedriver this is more complicated. You cannot use the Builder to create sessions, you must manually create a server
instace and create a session using it:

```typescript
    if (JestInstance.isLocal() && browser === "chrome") {
      const windowSize = { width: config.resolution.width, height: config.resolution.height };
      const options = new ChromeOptions().windowSize(windowSize).setChromeLogFile("/tmp/chrome.log");
      const service = new ChromeServiceBuilder().loggingTo("/tmp/chromedriver.log").enableVerboseLogging().build();
      return ChromeDriver.createSession(options, service);
    }
```

Remember also, that when you close the session the logs get erased, so copy them to another location for analysis.


---
## References
1. 
