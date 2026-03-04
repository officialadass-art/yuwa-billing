import {
  BorderRadius,
  BrandColors,
  FontSizes,
  Spacing,
} from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DeviceInfo, Printer, PrinterConstants, usePrintersDiscovery } from 'react-native-esc-pos-printer';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

const MenuItem = ({
  icon,
  label,
  subtitle,
  onPress,
  showArrow = true,
  danger = false,
}: MenuItemProps) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
      <Ionicons
        name={icon}
        size={22}
        color={danger ? BrandColors.danger : BrandColors.primary}
      />
    </View>
    <View style={styles.menuContent}>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
        {label}
      </Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {showArrow && (
      <Ionicons
        name="chevron-forward"
        size={20}
        color={BrandColors.gray[400]}
      />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, currentBusiness, logout } = useAuth();
  const [showPrinterModal, setShowPrinterModal] = useState(false)
  const {start, isDiscovering, printers} = usePrintersDiscovery()

  useEffect(() => {
    if (showPrinterModal) {
      start();
    }
  }, [showPrinterModal])

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/auth/welcome");
        },
      },
    ]);
  };

  const handleTestPrint = async (printer: DeviceInfo) => {
    const printerInstance = new Printer({
        target: printer.target,
        deviceName: printer.deviceName,
      });

      const res = await printerInstance.addQueueTask(async () => {
        await Printer.tryToConnectUntil(
          printerInstance,
          (status) => status.online.statusCode === PrinterConstants.TRUE
        );
        await printerInstance.addText('DUDE!');
        await printerInstance.addFeedLine();
        await printerInstance.addCut();
        const result = await printerInstance.sendData();
        await printerInstance.disconnect();
        return result;
    })
  }

  const handleSwitchBusiness = () => {
    router.push("/auth/business-list");
  };

  const getCafeAddress = () => {
    if (!currentBusiness) return "Your Cafe Address";
    const { address } = currentBusiness;
    return `${address?.line1 || ''}, ${address?.line2 || ''}, ${address?.city || ''}, ${address?.state || ''} - ${address?.postalCode || ''}`;
  }

    const renderPrinter = ({ item }: { item: DeviceInfo }) => (
      <View style={styles.itemCard}>
        
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.deviceName}</Text>
          <Text style={styles.itemSubInfo}>{item.deviceType}</Text>
          <Text style={styles.itemSubInfo}>{item.ipAddress} - {item.bdAddress}</Text>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.itemPrimaryButton}
            onPress={() => handleTestPrint(item)}
          >
            <Ionicons name="print" size={18} color={BrandColors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BrandColors.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={BrandColors.gray[700]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Business Card */}
        <View style={styles.businessCard}>
          <View style={styles.businessLogo}>
            <Ionicons name="cafe" size={40} color={BrandColors.primary} />
          </View>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>
              {currentBusiness?.name || "CafeBill"}
            </Text>
            <Text style={styles.businessAddress}>
              {getCafeAddress()}
            </Text>
          </View>
          <TouchableOpacity style={styles.editBusinessButton}>
            <Ionicons name="pencil" size={18} color={BrandColors.primary} />
          </TouchableOpacity>
        </View>

        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="person-outline"
              label="My Profile"
              subtitle={user?.name || "Cafe Owner"}
              onPress={() =>
                Alert.alert("Profile", "Edit profile feature coming soon")
              }
            />
            <MenuItem
              icon="call-outline"
              label="Phone Number"
              subtitle={user?.mobile ? `+91 ${user.mobile}` : "+91 XXXXXXXXXX"}
              onPress={() =>
                Alert.alert("Phone", "Change phone number feature coming soon")
              }
            />
          </View>
        </View>

        {/* Business Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business</Text>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="business-outline"
              label="Organizations"
              subtitle="Manage your businesses"
              onPress={handleSwitchBusiness}
            />
            <MenuItem
              icon="people-outline"
              label="Access & Permissions"
              subtitle="Manage staff access"
              onPress={() =>
                Alert.alert("Access", "Access management coming soon")
              }
            />
            <MenuItem
              icon="document-text-outline"
              label="GST Details"
              subtitle={currentBusiness?.leagalInfo?.gstNumber || "Not configured"}
              onPress={() =>
                Alert.alert("GST", "GST configuration coming soon")
              }
            />
          </View>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="print-outline"
              label="Printer Setup"
              subtitle="Configure receipt printer"
              onPress={() =>
                setShowPrinterModal(true)
              }
            />
            <MenuItem
              icon="notifications-outline"
              label="Notifications"
              subtitle="Manage alerts"
              onPress={() =>
                Alert.alert(
                  "Notifications",
                  "Notification settings coming soon",
                )
              }
            />
            <MenuItem
              icon="moon-outline"
              label="Appearance"
              subtitle="Light mode"
              onPress={() =>
                Alert.alert("Appearance", "Theme settings coming soon")
              }
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => Alert.alert("Help", "Help center coming soon")}
            />
            <MenuItem
              icon="chatbubble-outline"
              label="Contact Us"
              onPress={() =>
                Alert.alert("Contact", "Contact options coming soon")
              }
            />
            <MenuItem
              icon="star-outline"
              label="Rate the App"
              onPress={() =>
                Alert.alert("Rate", "Rate us on Play Store / App Store")
              }
            />
            <MenuItem
              icon="information-circle-outline"
              label="About"
              subtitle="Version 1.0.0"
              onPress={() =>
                Alert.alert(
                  "About",
                  "CafeBill v1.0.0\nSmart Billing for Smart Cafes",
                )
              }
            />
          </View>
        </View>

        {/* Logout */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="log-out-outline"
              label="Logout"
              onPress={handleLogout}
              showArrow={false}
              danger
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for Cafes</Text>
          <Text style={styles.versionText}>CafeBill v1.0.0</Text>
        </View>
      </ScrollView>

      <Modal
          visible={showPrinterModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowPrinterModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Printers
                </Text>
                <TouchableOpacity onPress={() => setShowPrinterModal(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={BrandColors.gray[600]}
                  />
                </TouchableOpacity>
              </View>
  
              <View
                style={styles.modalBody}
              >

              {/* Display the list of discovered printers */}
              <FlatList
                data={printers}
                keyExtractor={(item) => item.deviceName}
                renderItem={renderPrinter}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons
                      name="cafe-outline"
                      size={64}
                      color={BrandColors.gray[300]}
                    />
                    <Text style={styles.emptyText}>No Printers found</Text>
                  </View>
                }
              />
                
              </View>
  
              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalPrimaryButton}
                  onPress={() => setShowPrinterModal(false)}
                >
                  <Text style={styles.modalPrimaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Modal>
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
    paddingVertical: Spacing.md,
    backgroundColor: BrandColors.white,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.gray[200],
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: "700",
    color: BrandColors.gray[900],
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: BrandColors.gray[100],
    alignItems: "center",
    justifyContent: "center",
  },
  businessCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.white,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: BrandColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  businessLogo: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    backgroundColor: BrandColors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  businessInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  businessName: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: BrandColors.gray[900],
  },
  businessAddress: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[600],
    marginTop: Spacing.xs,
  },
  editBusinessButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: BrandColors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: BrandColors.gray[500],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  sectionContent: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.gray[100],
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: BrandColors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  menuIconDanger: {
    backgroundColor: BrandColors.danger + "15",
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: BrandColors.gray[900],
  },
  menuLabelDanger: {
    color: BrandColors.danger,
  },
  menuSubtitle: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[500],
    marginTop: 2,
  },
  lastSection: {
    marginBottom: 0,
  },
  footer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontSize: FontSizes.md,
    color: BrandColors.gray[500],
  },
  versionText: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[400],
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: BrandColors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.gray[200],
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: BrandColors.gray[900],
  },
  modalBody: {
    padding: Spacing.lg,
  },
  modalActions: {
    flexDirection: "row",
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: BrandColors.gray[200],
  },
  modalSecondaryButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: BrandColors.gray[300],
    alignItems: "center",
  },
  modalSecondaryButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: BrandColors.gray[700],
  },
  modalPrimaryButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
  },
  modalPrimaryButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: BrandColors.white,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    color: BrandColors.gray[500],
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: BrandColors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  emptyButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: BrandColors.white,
  },
  itemCard: {
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
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  itemPrimaryButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: BrandColors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: BrandColors.gray[900],
  },
  itemSubInfo: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[500],
    marginTop: 2,
  }
});
