import { debug } from "../common/log.js";

import * as secrets from "../secrets";

const generateSettings = props => (
  <Page>
    <Text>Note: Please restart the app after changing settings.</Text>
    <Section title="Fitbit Login">
      <Oauth
        settingsKey="oauth"
        title="Login"
        label="Fitbit"
        status={(() => {
          if (props.settingsStorage.getItem("oauth")) {
            return "Authenticated";
          } else {
            return "Not Authenticated";
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
    <Section title="Weight Unit">
       <Select
         label="Unit"
         settingsKey="unit"
         options={[
          {name: "kg", value: "metric"},
          {name: "lbs", value: "us"}
         ]}
         selectViewTitle="Choose a unit"
        />
    </Section>
  </Page>
);

registerSettingsPage(generateSettings);
