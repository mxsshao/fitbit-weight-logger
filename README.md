# Weight Logger

An app to log today's weight and body fat to your Fitbit profile.
+ Before first use you need to login to your Fitbit account in the settings.
+ Requires your device to be connected to your phone and an active internet connection.
+ Supports kg and lbs.
+ Body fat percentage is optional.

## Screenshots

### Versa

<img src="screenshots/versa_main.png" width="200px" /> <img src="screenshots/versa_log.png" width="200px" /> <img src="screenshots/versa_log_weight.png" width="200px" /> <img src="screenshots/versa_log_fat.png" width="200px" /> <img src="screenshots/versa_lbs.png" width="200px" />

### Ionic

<img src="screenshots/ionic_main.png" width="200px" /> <img src="screenshots/ionic_log.png" width="200px" /> <img src="screenshots/ionic_log_weight.png" width="200px" /> <img src="screenshots/ionic_log_fat.png" width="200px" /> <img src="screenshots/ionic_lbs.png" width="200px" />

## Development

```javascript
npm install
```

### Build

```javascript
npx fitbit
fitbit$ build
fitbit$ install
```

## OAuth

+ Need to register app at <https://dev.fitbit.com/apps/new/>

## References

+ https://github.com/Fitbit/ossapps
+ Based on "Log weight" by benedicteb (<https://github.com/benedicteb/fitbit-log-weight>)
