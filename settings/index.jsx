import { debug } from "../common/log.js";

import * as secrets from "../secrets";

const generateSettings = props => (
  <Page>
    <Section title={<Text>Log in with your Fitbit account</Text>}>
      <Oauth
        settingsKey="oauth"
        title="Login"
        label="Fitbit"
        status={(() => {
          if (props.settingsStorage.getItem("oauth")) {
            return "Authenticated";
          } else {
            return "Not authenticated";
          }
        })()}
        authorizeUrl={secrets.AUTHURL}
        requestTokenUrl={secrets.REQUESTURL}
        clientId={secrets.CLIENTID}
        clientSecret={secrets.CLIENTSECRET}
        scope="weight"
        onAccessToken={async data => {
          debug(data);
        }}
      />
    </Section>
  </Page>
);

registerSettingsPage(generateSettings);
