import API from "./../../api"; // ✅ fixed path
import { RootStackParamList, User } from ".././../navigation/types"; 
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

const Login: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      const data = res.data;

      console.log("Login response:", data); // Debug

      // Store token & user locally
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      // Robust role check
      const role = data.user.role?.toString().trim().toLowerCase();

      if (role === "borrower") {
        Alert.alert("Success", "Logged in successfully!", [
          {
            text: "OK",
            onPress: () =>
              navigation.replace("Book", { user: data.user as User }),
          },
        ]);
      } else {
        Alert.alert("Notice", "Only borrowers can access books.");
      }
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert(
        "Login Failed",
        err.response?.data?.message || "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: "https://iic.edu.np/image/favicon.png" }}
          style={{
            width: 80,
            height: 91,
            alignSelf: "center",
            marginBottom: 16,
          }}
        />
        <Text style={styles.subtitle}>Login to Your Account</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <FontAwesome5
            name="envelope"
            size={20}
            color="#000"
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <FontAwesome5
            name="lock"
            size={20}
            color="#000"
            style={styles.icon}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
  },
  subtitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    height: 50,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  loginButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
