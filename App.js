import { StatusBar } from 'expo-status-bar';
import { Authenticator } from '@aws-amplify/ui-react-native';

import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
import HomeScreen from './screens/HomeScreen';

Amplify.configure(amplifyconfig);

const App = () => {
  return (
    <Authenticator.Provider>
      <Authenticator
        components={{
          SignUp: ({ fields, ...props }) => (
            <Authenticator.SignUp
              {...props}
              fields={[
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "Enter your Email"
                },
                ...fields
              ]}
            />
          )
        }}
      >
        <HomeScreen />
      </Authenticator>
      <StatusBar style="auto" />
    </Authenticator.Provider>
  );
}

export default App;