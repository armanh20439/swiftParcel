"use client";
import React from "react";
import Link from "next/link";

export default function NotFound() {
  // Styles Object
  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      flexDirection: "column" as "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      fontFamily: "sans-serif",
      textAlign: "center" as "center",
      padding: "20px",
    },
    errorCode: {
      fontSize: "120px",
      fontWeight: "900",
      color: "#00302E",
      margin: "0",
      lineHeight: "1",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
      textTransform: "uppercase" as "uppercase",
      marginTop: "10px",
    },
    description: {
      color: "#666",
      maxWidth: "400px",
      fontSize: "16px",
      lineHeight: "1.6",
      margin: "20px 0 30px 0",
    },
    buttonContainer: {
      display: "flex",
      gap: "15px",
      flexWrap: "wrap" as "wrap",
      justifyContent: "center",
    },
    primaryBtn: {
      backgroundColor: "#00302E",
      color: "#fff",
      padding: "14px 28px",
      borderRadius: "12px",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "16px",
      border: "none",
      cursor: "pointer",
    },
    secondaryBtn: {
      backgroundColor: "#fff",
      color: "#00302E",
      padding: "14px 28px",
      borderRadius: "12px",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "16px",
      border: "2px solid #00302E",
      cursor: "pointer",
    },
    footer: {
      marginTop: "60px",
      fontSize: "10px",
      color: "#ccc",
      letterSpacing: "4px",
      textTransform: "uppercase" as "uppercase",
      fontWeight: "bold",
    }
  };

  return (
    <div style={styles.container}>
      {/* Visual Indicator */}
      <div style={{ fontSize: "60px", marginBottom: "10px" }}>📦 🔍</div>

      <h1 style={styles.errorCode}>404</h1>
      <h2 style={styles.title}>Parcel Not Found!</h2>
      
      <p style={styles.description}>
        The page you are looking for has been moved or doesn't exist. 
        Please return to the dashboard to track your parcels.
      </p>

      <div style={styles.buttonContainer}>
        <Link href="/" style={styles.primaryBtn}>
          Back to Home
        </Link>
        <Link href="/contact" style={styles.secondaryBtn}>
          Support
        </Link>
      </div>

      <div style={styles.footer}>
        Swift-Parcel Management System • 2026
      </div>
    </div>
  );
}