import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./../../api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const defaultProfileImage = require("../../assets/images/DefaultAvatar.png");

interface BookType {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  available: number;
  coverImage?: string;
  borrowedByMe?: boolean;
  borrowId?: string | null;
}

const getBookImageUri = (coverImage?: string) => {
  if (!coverImage) return undefined;
  return coverImage.startsWith("/")
    ? "http://192.168.100.136:5000"
    : coverImage;
};


const Book: React.FC = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; role?: string; email?: string; profilePicture?: string } | null>(null);
  useEffect(() => {
    fetchBooks();
    const fetchUser = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        setUser(userObj);
      }
    };
    fetchUser();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await API.get("/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to fetch books"
      );
    }
  };

  const handleBorrow = async (bookId: string) => {
  try {
    const token = await AsyncStorage.getItem("token"); // ✅ use AsyncStorage
    if (!token) {
      Alert.alert("Error", "You must be logged in to borrow a book");
      return;
    }

    const decoded: any = jwtDecode(token);
    const userId = decoded.id; // 👈 extract userId from token

    const res = await axios.post(
          "http://192.168.100.136:5000/api/borrows", // ✅ use your LAN IP, not localhost
          { bookId, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      
        Alert.alert("Success", "Borrow request sent successfully!");
        console.log(res.data);
      } catch (err: any) {
        console.error(err.response?.data || err);
        Alert.alert(
          "Error",
          `Failed to send borrow request: ${err.response?.data?.message || err.message}`
        );
      }
    };


    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        // Optionally clear any other stored data
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }], // Replace "Login" with your login screen name
        });
      } catch (err) {
        console.error("Logout error:", err);
      }
    };

  const handleReturn = async (borrowId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await API.post(
        "/borrows/return",
        { borrowId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBooks(prev =>
        prev.map(book =>
          book.borrowId === borrowId
            ? {
                ...book,
                borrowedByMe: false,
                borrowId: null,
                available: book.available + 1,
              }
            : book
        )
      );
      Alert.alert("Success", "Book returned successfully!");
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to return book"
      );
    }
  };

  const filteredBooks = books.filter(
    book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to chunk books into rows of 2
  const getRows = (booksArr: BookType[]) => {
    const rows = [];
    for (let i = 0; i < booksArr.length; i += 2) {
      rows.push(booksArr.slice(i, i + 2));
    }
    return rows;
  };

  return (
    <>
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.logo}>All Books</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search books by title or author..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity onPress={() => setProfileOpen(true)}>
          <Image
            source={
              user?.profilePicture
                ? { uri: user.profilePicture }
                : defaultProfileImage
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Modal */}
      <Modal visible={profileOpen} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 24,
            alignItems: "center",
            width: 300
          }}>
            <View style={{ width: "100%", alignItems: "flex-end", position: "absolute", top: 0, right: 0, zIndex: 1 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 100,
                  alignItems: "flex-end",
                }}
                onPress={() => setProfileOpen(false)}
              >
                <Text style={{ color: "#000000", fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>
            </View>

            <Image
              source={
                user?.profilePicture
                  ? { uri: user?.profilePicture }
                  : defaultProfileImage
              }
              style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 12 }}
            />
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 4 }}>
              {user?.name || "User"}
            </Text>
            <Text style={{ color: "#555", marginBottom: 12 }}>
              {user?.role || "role"}
            </Text>
            <Text style={{ color: "#555", marginBottom: 12 }}>
              {user?.email || ""}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 8 }}>
              
              <TouchableOpacity
                style={{
                  backgroundColor: "#1E3A8A",
                  paddingHorizontal: 27,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
                onPress={handleLogout}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
              </TouchableOpacity>
            </View>


          </View>
        </View>
      </Modal>

      {/* Book List */}
      <ScrollView contentContainerStyle={styles.container}>
        {filteredBooks.length > 0 ? (
          getRows(filteredBooks).map((row, rowIdx) => (
            <View key={rowIdx} style={styles.row}>
              {row.map(book => (
                <View key={book._id} style={styles.bookCard}>
                  <View style={styles.bookImageContainer}>
                    {book.coverImage ? (
                      <Image
                        source={{ uri: getBookImageUri(book.coverImage) }}
                        style={styles.bookImage}
                        resizeMode="cover"
                      />
                    ) : null}
                  </View>
                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>By: {book.author}</Text>
                    <Text style={styles.bookISBN}>ISBN: {book.isbn}</Text>
                    <Text style={styles.bookAvailability}>
                      {book.available > 0 ? (
                        <Text style={{ color: "green", fontWeight: "bold" }}>
                          {book.available} available
                        </Text>
                      ) : (
                        <Text style={{ color: "red", fontWeight: "bold" }}>
                          Not available
                        </Text>
                      )}
                    </Text>
                    {book.borrowedByMe ? (
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: "green" }]}
                        onPress={() => handleReturn(book.borrowId!)}
                      >
                        <Text style={styles.buttonText}>Return</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.button,
                          book.available > 0
                            ? { backgroundColor: "#1E3A8A" }
                            : { backgroundColor: "#ccc" },
                        ]}
                        disabled={book.available === 0}
                        onPress={() => handleBorrow(book._id)}
                      >
                        <Text style={styles.buttonText}>Borrow</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
              {/* If odd number of books, add an empty View to fill space */}
              {row.length === 1 && <View style={[styles.bookCard, { backgroundColor: "transparent", elevation: 0 }]} />}
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No books found
          </Text>
        )}
      </ScrollView>
    </View>
    </>
  );
};

export default Book;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginTop: 32,
    borderBottomColor: "#ccc",
  },
  logo: { fontSize: 16, fontWeight: "bold", color: "black", marginRight: 16 },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 9,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  container: { padding: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  bookCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    marginHorizontal: 4,
    marginBottom: 0,
    minWidth: 0,
  },
  bookInfo: { flex: 1, padding: 12, justifyContent: "space-between" },
  bookTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  bookAuthor: { color: "#555", marginBottom: 2 },
  bookISBN: { color: "#555", marginBottom: 4, fontSize:13, },
  bookAvailability: { marginBottom: 8 },
  bookImageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  bookImage: { width: "100%", height: 120, margin: 0 },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    alignSelf: "flex-start",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 12 },
});