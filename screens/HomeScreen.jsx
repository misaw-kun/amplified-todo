import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { generateClient } from 'aws-amplify/api';
import { createTodo } from '../src/graphql/mutations';
import { listTodos } from '../src/graphql/queries';
import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react-native';

const initialState = { name: '', description: '' };
const client = generateClient();

export default function HomeScreen() {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await client.graphql({
        query: listTodos
      })

      const todos = todoData.data.listTodos.items;
      setTodos(todos);

    } catch (error) {
      console.log(error);
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;

      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);

      await client.graphql({
        query: createTodo,
        variables: {
          input: todo
        }
      });
    } catch (error) {
      console.log('error creating todo:', err);
    }
  }

  const userSelector = (context) => [context.user];

  const SignOutButton = () => {
    const { user, signOut } = useAuthenticator(userSelector);
    return (
      <Pressable onPress={signOut} style={[styles.buttonContainer, { marginBottom: 10 }]}>
        <Text style={styles.buttonText}>
          Hello, {user?.username}! Click here to sign out!
        </Text>
      </Pressable>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <SignOutButton />
        <TextInput
          onChangeText={(value) => setInput('name', value)}
          style={styles.input}
          value={formState.name}
          placeholder="Name"
        />
        <TextInput
          onChangeText={(value) => setInput('description', value)}
          style={styles.input}
          value={formState.description}
          placeholder="Description"
        />
        <Pressable onPress={addTodo} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Create todo</Text>
        </Pressable>
        {todos.map((todo, index) => (
          <View key={todo.id ? todo.id : index} style={styles.todo}>
            <Text style={styles.todoName}>{todo.name}</Text>
            <Text style={styles.todoDescription}>{todo.description}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { width: 400, flex: 1, padding: 50, alignSelf: 'center' },
  todo: { marginBottom: 15 },
  input: {
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18
  },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { fontSize: 14 },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 8
  },
  buttonText: { color: 'white', padding: 16, fontSize: 18 }
});
