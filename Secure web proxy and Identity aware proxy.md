In GCP these two proxies work in opposite direction: SWP proxies egress/outgoing traffic from the cloud, while the IaP proxies incoming, ingress traffic.

## Secure web proxy
Secure web proxy secures egress traffic at layer 7. It requires explicit configuration, as endpoints need to know that they are communicating through a proxy. You would use SWP with high security applications, where you would couple the usage of SWP with the following route configurations in your VPC:
- Delete the default route to the internet gateway
- Add a higher-priority deny all for outgoing traffic.
Communication with the internet now becomes explicit. Your endpoints need to have explicit configuration for the SWP proxy. Here is a code sample for making a connection from an app inside the VPC to a server in the greater internet:
```js
// Import the Axios library for making HTTP requests
const axios = require('axios');

/**
 * Sends a GET request to a specified URL through a Secure Web Proxy (SWP).
 * This function demonstrates how to configure Axios to use a proxy.
 */
async function sendRequestWithProxy() {
  // Define the target URL and proxy details.
  // IMPORTANT: Replace the placeholder values with your actual SWP configuration.
  const targetUrl = 'http://example.com';
  const proxyHost = 'your_proxy_host_here'; // e.g., '192.168.1.1'
  const proxyPort = 8080; // e.g., 8080

  console.log(`Sending GET request to ${targetUrl} via proxy ${proxyHost}:${proxyPort}...`);

  try {
    const response = await axios.get(targetUrl, {
      // The 'proxy' property tells Axios to route the request through the specified proxy server.
      proxy: {
        protocol: 'http', // The protocol of your proxy. Use 'https' if your proxy uses TLS.
        host: proxyHost,
        port: proxyPort
      },
      // You can also add other configurations here, such as headers or timeout settings.
      // For example:
      // headers: {
      //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36'
      // },
      // timeout: 5000 // Timeout in milliseconds
    });

    // If the request is successful, log the response data and status.
    console.log('Request successful!');
    console.log('Status Code:', response.status);
    console.log('Response Data:', response.data);

  } catch (error) {
    // If an error occurs, log a user-friendly message.
    // Check if the error is an AxiosError, which provides more details.
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx.
        console.error('Error: The server responded with a non-2xx status code.');
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received.
        console.error('Error: No response was received from the server.');
        console.error('Request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an error.
        console.error('Error:', error.message);
      }
    } else {
      // A non-Axios-related error occurred.
      console.error('An unexpected error occurred:', error.message);
    }
  }
}

// Call the function to send the request.
sendRequestWithProxy();

```

Having said this, it is also possible to configure SWP to act as the *next hop* for internet routes using routing.

## Identity aware proxy
IAP is the layer before your load balancer that inspects the traffic to see whether the user is authenticated or not. If not, then IAP initiates authentication similarly to the Identity Platform. The authentication is based on cookies, not tokens.

