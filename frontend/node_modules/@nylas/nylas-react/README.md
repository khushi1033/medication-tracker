<a href="https://www.nylas.com/">
    <img src="https://brand.nylas.com/assets/downloads/logo_horizontal_png/Nylas-Logo-Horizontal-Blue_.png" alt="Aimeos logo" title="Aimeos" align="right" height="60" />
</a>

# Nylas React SDK

![npm](https://img.shields.io/npm/v/@nylas/nylas-react)

This is the GitHub repository for the Nylas React SDK. The Nylas Communications Platform provides REST APIs for [Email](https://developer.nylas.com/docs/connectivity/email/), [Calendar](https://developer.nylas.com/docs/connectivity/calendar/), and [Contacts](https://developer.nylas.com/docs/connectivity/contacts/), and the Node SDK is the quickest way to build your integration using React.

Here are some resources to help you get started:

- [Quickstart](https://developer.nylas.com/docs/the-basics/quickstart/)
- [Nylas API Reference](https://developer.nylas.com/docs/api/)


## ⚙️ Install

To install the Nylas React SDK, you will first need to have [npm](https://www.npmjs.com/get-npm) installed on your machine.

Then, head to the nearest command line and run the following:
```bash
npm install @nylas/nylas-react
```

To install this package from source, clone this repo and run `npm install` from inside the project directory:

```bash
git clone https://github.com/nylas/nylas-react.git
cd nylas-react
npm install
```

## ⚡️ Usage

The Nylas React SDK provides an easy way to implement authentication in your react application.

### Components

The Nylas React SDK currently provides the following component:

* [NylasProvider](src/nylas-provider.tsx) - This is a component that utilizes React Context API to maintain a state for authentication and the [Nylas JS](https://github.com/nylas/nylas-js) client. This context can be accessed via the [useNylas](https://github.com/nylas/nylas-react#useNylas) hook.

### Hooks
These are the following options that can be passed in to configure an instance of the Nylas JS SDK

* useNylas - returns `Nylas`; an instance of the [Nylas JavaScript SDK](https://github.com/nylas/nylas-js)

### Example
Here's how you can get started with integrating the React SDK into your application for the purpose of authenticating. For this example we're going to wrap it around the entire app, but feel free to wrap the component where you see fit.

#### index.tsx
```typescript jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import {NylasProvider} from "@nylas/nylas-react";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <NylasProvider serverBaseUrl="http://localhost:9000">
      <App />
    </NylasProvider>
  </React.StrictMode>
);
```

#### App.tsx
```typescript jsx
import React, { useEffect } from 'react';

import {useNylas} from "@nylas/nylas-react";

function App() {
  const { authWithRedirect, exchangeCodeFromUrlForToken } = useNylas();
  const [email, setEmail] = React.useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("code")) {
      exchangeCodeFromUrlForToken().then((token: string) => {
        // do something with the response
      });
    }
  }, [exchangeCodeFromUrlForToken]);

  return (
    <div className="App">
      <section style={{width: '80vw', margin: "10vh auto"}}>
        <h1>Read emails sample app</h1>
        <p>Authenticate your email to read</p>
        <div style={{marginTop: "30px"}}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              authWithRedirect({emailAddress: email, successRedirectUrl: "/success"})
            }}
          >
            <input
              required
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Connect</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;

```

## 💙 Contributing

Interested in contributing to the Nylas JavaScript SDK project? Thanks so much for your interest! We are always looking for improvements to the project and contributions from open-source developers are greatly appreciated.

Please refer to [Contributing](Contributing.md) for information about how to make contributions to this project. We welcome questions, bug reports, and pull requests.

## 📝License

This project is licensed under the terms of the MIT license. Please refer to [LICENSE](LICENSE.txt) for the full terms. 


