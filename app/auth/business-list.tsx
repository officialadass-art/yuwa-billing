import { APIEndpoints } from "@/constants/apiEndpoint";
import { fetch } from 'expo/fetch';
import {
    BorderRadius,
    BrandColors,
    FontSizes,
    Spacing,
} from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Business } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Sample businesses
// const businesses: Business[] = [
//   {
//     id: "1",
//     name: "Sunrise Cafe",
//     logo: "",
//     address: "123 Main Street, Downtown",
//     phone: "+91 9876543210",
//     gstNumber: "GST123456789",
//   },
//   {
//     id: "2",
//     name: "Brew House",
//     logo: "",
//     address: "456 Park Avenue, Uptown",
//     phone: "+91 9876543211",
//     gstNumber: "GST987654321",
//   },
//   {
//     id: "3",
//     name: "The Coffee Corner",
//     logo: "",
//     address: "789 Lake View Road",
//     phone: "+91 9876543212",
//   },
// ];

export default function BusinessListScreen() {
  const { user, selectBusiness, getToken } = useAuth();
  const [businessList, setBusinessList] = useState<Business[]>([]);

  useEffect(() => {
    // Fetch businesses from API based on user ID
    const fetchBusinesses = async () => {
      try {
        // authentication Header
        // Replace with your API endpoint
        const response = await fetch(`${APIEndpoints.baseURL}${APIEndpoints.business.list}`, {
          method: 'GET',
          headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
          }
        });
        const data = await response.json();
        setBusinessList(data.data);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      }
    };

    if (user) {
      fetchBusinesses();
    }
  }, [user]);

  const handleSelectBusiness = (business: Business) => {
    selectBusiness(business);
    router.replace("/(tabs)");
  };

  const renderBusinessItem = ({ item }: { item: Business }) => (
    <TouchableOpacity
      style={styles.businessCard}
      onPress={() => handleSelectBusiness(item)}
      activeOpacity={0.7}
    >
      <View style={styles.businessIcon}>
        <Ionicons name="cafe" size={32} color={BrandColors.primary} />
      </View>
      <View style={styles.businessInfo}>
        <Text style={styles.businessName}>{item.name}</Text>
        <Text style={styles.businessAddress}>{item.address?.line1}, {item.address?.line2}, {item.address?.city}, {item.address?.state} - {item.address?.postalCode}, {item.address?.country} </Text>
        <View style={styles.businessMeta}>
          <Ionicons
            name="call-outline"
            size={14}
            color={BrandColors.gray[500]}
          />
          <Text style={styles.businessPhone}>{item.contact?.phone}</Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={24}
        color={BrandColors.gray[400]}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BrandColors.white} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || "User"} 👋</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color={BrandColors.primary} />
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Select Business</Text>
        <Text style={styles.subtitle}>Choose a cafe to manage</Text>
      </View>

      {/* Business List */}
      <FlatList
        data={businessList}
        keyExtractor={(item) => item.id}
        renderItem={renderBusinessItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Business Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={BrandColors.accent}
          />
          <Text style={styles.addButtonText}>Add New Business</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.gray[50],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: BrandColors.white,
  },
  greeting: {
    fontSize: FontSizes.md,
    color: BrandColors.gray[600],
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: BrandColors.gray[900],
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BrandColors.gray[100],
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: BrandColors.white,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: "700",
    color: BrandColors.gray[900],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: BrandColors.gray[600],
  },
  listContent: {
    padding: Spacing.lg,
  },
  businessCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: BrandColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  businessIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: BrandColors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: BrandColors.gray[900],
    marginBottom: Spacing.xs,
  },
  businessAddress: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[600],
    marginBottom: Spacing.xs,
  },
  businessMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  businessPhone: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[500],
  },
  bottomContainer: {
    padding: Spacing.lg,
    backgroundColor: BrandColors.white,
    borderTopWidth: 1,
    borderTopColor: BrandColors.gray[200],
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: BrandColors.accent,
    borderStyle: "dashed",
    gap: Spacing.sm,
  },
  addButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: BrandColors.accent,
  },
});
