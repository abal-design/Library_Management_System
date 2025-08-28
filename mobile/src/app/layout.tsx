// src/app/layout.tsx
import React, { ReactNode } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});
