import { APIEndpoints } from "@/constants/apiEndpoint";
import {
  BorderRadius,
  BrandColors,
  FontSizes,
  Spacing,
} from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { fetch } from 'expo/fetch';
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid 10-digit mobile number",
      );
      return;
    }
    // Making POST request to send OTP
    setIsLoading(true);
    try {
      const response = await fetch(`${APIEndpoints.baseURL}${APIEndpoints.auth.sendOtp}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: `+91${mobileNumber}` }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
    
    router.push({
      pathname: "/auth/otp",
      params: { mobile: `${mobileNumber}` }
    });

  } catch (error) {
    Alert.alert("Error", error.message || "Failed to send OTP");
    setIsLoading(false);
  } finally {
    setIsLoading(false);
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BrandColors.white} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={BrandColors.gray[800]} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="phone-portrait-outline"
              size={40}
              color={BrandColors.primary}
            />
          </View>
          <Text style={styles.title}>Login to CafeBill</Text>
          <Text style={styles.subtitle}>
            Enter your mobile number to receive a verification code
          </Text>
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile number"
            placeholderTextColor={BrandColors.gray[400]}
            keyboardType="phone-pad"
            maxLength={10}
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />
          {mobileNumber.length === 10 && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={BrandColors.success}
            />
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            mobileNumber.length !== 10 && styles.continueButtonDisabled,
          ]}
          onPress={handleSendOTP}
          disabled={mobileNumber.length !== 10 || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <Text style={styles.continueButtonText}>Sending OTP...</Text>
          ) : (
            <>
              <Text style={styles.continueButtonText}>Send OTP</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={BrandColors.white}
              />
            </>
          )}
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color={BrandColors.gray[500]}
          />
          <Text style={styles.infoText}>
            Your number is secure and will only be used for verification
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: BrandColors.gray[100],
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  header: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BrandColors.gray[100],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: "700",
    color: BrandColors.gray[900],
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: BrandColors.gray[600],
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.gray[100],
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 56,
    marginBottom: Spacing.lg,
  },
  countryCode: {
    paddingRight: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: BrandColors.gray[300],
    marginRight: Spacing.md,
  },
  countryCodeText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: BrandColors.gray[800],
  },
  input: {
    flex: 1,
    fontSize: FontSizes.lg,
    color: BrandColors.gray[900],
    letterSpacing: 1,
  },
  continueButton: {
    backgroundColor: BrandColors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  continueButtonDisabled: {
    backgroundColor: BrandColors.gray[400],
  },
  continueButtonText: {
    color: BrandColors.white,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[500],
    textAlign: "center",
    flex: 1,
  },
});
