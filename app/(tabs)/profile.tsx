import { SkeletonBusinessList } from "@/components/skeleton-business-card";
import {
    BorderRadius,
    BrandColors,
    FontSizes,
    Spacing,
} from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { requestPrinterPermissions } from "@/hooks/use-permissions";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    BLEPrinter,
    IBLEPrinter,
} from "react-native-thermal-receipt-printer-image-qr";

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
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [printers, setPrinters] = useState<IBLEPrinter[]>([]);
  const [connectedPrinter, setConnectedPrinter] = useState<IBLEPrinter | null>(
    null,
  );
  const [connectedMacAddress, setConnectedMacAddress] = useState<string | null>(
    null,
  );
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editRole, setEditRole] = useState("Owner");
  const [editMobile, setEditMobile] = useState(user?.mobile || "");
  const [editGst, setEditGst] = useState(
    currentBusiness?.leagalInfo?.gstNumber || "",
  );
  const [editCafeName, setEditCafeName] = useState(
    currentBusiness?.name || "CafeBill",
  );
  const [editCafeAddress, setEditCafeAddress] = useState(
    currentBusiness?.address?.line1 || "",
  );

  useEffect(() => {
    if (showPrinterModal) {
      discoverPrinters();
    }
  }, [showPrinterModal]);

  const discoverPrinters = async () => {
    try {
      setIsDiscovering(true);
      console.log("Initializing BLEPrinter...");
      await BLEPrinter.init();
      console.log("Getting device list...");
      const deviceList = await BLEPrinter.getDeviceList();
      console.log("Devices found count:", deviceList?.length);
      if (deviceList && deviceList.length > 0) {
        console.log(
          "First device structure:",
          JSON.stringify(deviceList[0], null, 2),
        );
        console.log("First device keys:", Object.keys(deviceList[0]));
      }
      setPrinters(deviceList || []);
    } catch (error) {
      console.error("Printer discovery error:", error);
      Alert.alert("Error", "Failed to discover printers: " + String(error));
    } finally {
      setIsDiscovering(false);
    }
  };

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

  const handleConnectPrinter = async (printer: IBLEPrinter) => {
    try {
      console.log("Connecting to printer:", printer);
      const macAddress = printer.inner_mac_address?.trim() || "";
      console.log("MAC Address:", macAddress);
      Alert.alert("Connecting", "Connecting to " + printer.device_name + "...");

      await BLEPrinter.connectPrinter(macAddress);
      console.log("Connected successfully");

      setConnectedPrinter(printer);
      setConnectedMacAddress(macAddress);
      Alert.alert("Success", "Connected to " + printer.device_name);
    } catch (error) {
      console.error("Connection error:", error);
      Alert.alert("Error", "Failed to connect: " + String(error));
    }
  };

  const handleTestPrint = async (printer: IBLEPrinter) => {
    try {
      console.log("Test printing on printer:", printer);
      Alert.alert("Printing", "Sending test print...");

      await BLEPrinter.connectPrinter(printer.inner_mac_address);
      console.log("Connected successfully");

      await BLEPrinter.printText("<C>Test Print</C>\n");
      await BLEPrinter.printText("--------------------------------\n");
      await BLEPrinter.printText("Printer is working!\n");
      await BLEPrinter.printText("--------------------------------\n\n\n");

      Alert.alert("Success", "Test print sent successfully!");
      console.log("Print completed");
    } catch (error) {
      console.error("Print error:", error);
      Alert.alert("Error", "Failed to print: " + String(error));
    }
  };

  const handleSwitchBusiness = () => {
    router.push("/auth/business-list");
  };

  const handlePrinterSetup = async () => {
    try {
      // Request permissions before opening printer modal
      const permissionsGranted = await requestPrinterPermissions();

      if (permissionsGranted) {
        setShowPrinterModal(true);
      }
    } catch (error) {
      console.error("Error requesting printer permissions:", error);
      Alert.alert("Error", "Failed to request permissions. Please try again.");
    }
  };

  const getCafeAddress = () => {
    if (!currentBusiness) return "Your Cafe Address";
    const { address } = currentBusiness;
    return `${address?.line1 || ""}, ${address?.line2 || ""}, ${address?.city || ""}, ${address?.state || ""} - ${address?.postalCode || ""}`;
  };

  const renderPrinter = ({ item }: { item: IBLEPrinter }) => {
    // Extract device name from the printer object
    const printerName = (item as any).device_name || "Unknown Printer";
    const macAddress = item.inner_mac_address;
    const isConnected = connectedPrinter?.inner_mac_address === macAddress;

    return (
      <View style={[styles.itemCard, isConnected && styles.itemCardConnected]}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{printerName}</Text>
          <Text style={styles.itemSubInfo}>{macAddress}</Text>
          {isConnected && (
            <Text style={styles.connectedBadge}>✓ Connected</Text>
          )}
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={[
              styles.itemPrimaryButton,
              isConnected && styles.itemPrimaryButtonConnected,
            ]}
            onPress={() =>
              isConnected ? handleTestPrint(item) : handleConnectPrinter(item)
            }
          >
            <Ionicons
              name={isConnected ? "print" : "link"}
              size={18}
              color={BrandColors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        <TouchableOpacity
          style={styles.businessCard}
          onPress={() => setShowEditProfileModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.businessLogo}>
            <Ionicons name="cafe" size={40} color={BrandColors.primary} />
          </View>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>
              {currentBusiness?.name || "CafeBill"}
            </Text>
            <Text style={styles.businessAddress}>{getCafeAddress()}</Text>
          </View>
          <View style={styles.editBusinessButton}>
            <Ionicons name="pencil" size={18} color={BrandColors.primary} />
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="business-outline"
              label="Businesses"
              subtitle="Manage your businesses"
              onPress={handleSwitchBusiness}
            />
            <MenuItem
              icon="grid-outline"
              label="Categories"
              subtitle="Manage your categories"
              onPress={() => router.push("/categories")}
            />
            <MenuItem
              icon="person-outline"
              label="Role"
              subtitle={editRole}
              onPress={() => {}}
              showArrow={false}
            />
            <MenuItem
              icon="call-outline"
              label="Mobile number"
              subtitle={editMobile || "+91 XXXXXXXXXX"}
              onPress={() => {}}
              showArrow={false}
            />
            <MenuItem
              icon="document-text-outline"
              label="GST"
              subtitle={editGst || "Not configured"}
              onPress={() => setShowEditProfileModal(true)}
            />
            <MenuItem
              icon="print-outline"
              label="Printer setup"
              subtitle="Configure receipt printer"
              onPress={handlePrinterSetup}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="help-circle-outline"
              label="Help and support"
              onPress={() => router.push("/help")}
            />
            <MenuItem
              icon="star-outline"
              label="Rate the App"
              onPress={() =>
                Linking.openURL("market://details?id=com.leka.billing").catch(
                  () =>
                    Linking.openURL(
                      "https://play.google.com/store/apps/details?id=com.leka.billing",
                    ),
                )
              }
            />
            <MenuItem
              icon="information-circle-outline"
              label="About"
              onPress={() => router.push("/about")}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              label="Privacy Policy"
              onPress={() => router.push("/privacy-policy")}
            />
            <MenuItem
              icon="document-text-outline"
              label="Terms and conditions"
              onPress={() => router.push("/terms-conditions")}
            />
          </View>
        </View>

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

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for Cafes</Text>
          <Text style={styles.versionText}>CafeBill v1.0.0</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showEditProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfileModal(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={BrandColors.gray[600]}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cafe Name</Text>
                <TextInput
                  style={styles.input}
                  value={editCafeName}
                  onChangeText={setEditCafeName}
                  placeholder="Enter cafe name"
                  placeholderTextColor={BrandColors.gray[400]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cafe Address</Text>
                <TextInput
                  style={styles.input}
                  value={editCafeAddress}
                  onChangeText={setEditCafeAddress}
                  placeholder="Enter address details"
                  placeholderTextColor={BrandColors.gray[400]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>GST Number</Text>
                <TextInput
                  style={styles.input}
                  value={editGst}
                  onChangeText={setEditGst}
                  placeholder="Enter GST number"
                  autoCapitalize="characters"
                  placeholderTextColor={BrandColors.gray[400]}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={() => setShowEditProfileModal(false)}
              >
                <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalPrimaryButton}
                onPress={() => setShowEditProfileModal(false)}
              >
                <Text style={styles.modalPrimaryButtonText}>Save Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPrinterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrinterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Printers</Text>
              <View style={styles.modalHeaderActions}>
                <TouchableOpacity
                  onPress={discoverPrinters}
                  style={styles.refreshButton}
                >
                  <Ionicons
                    name="refresh"
                    size={20}
                    color={BrandColors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowPrinterModal(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={BrandColors.gray[600]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalBody}>
              {isDiscovering && <SkeletonBusinessList />}
              {/* Display the Connected and Available printers */}
              {!isDiscovering && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Connected Printers Section */}
                  {connectedPrinter && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>
                        ✓ Connected Printer
                      </Text>
                      {renderPrinter({ item: connectedPrinter })}
                    </View>
                  )}

                  {/* Available Printers Section */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                      Available Printers
                    </Text>
                    {printers.filter((p) => {
                      const macAddress = p.inner_mac_address?.trim() || "";
                      return (
                        !connectedMacAddress ||
                        macAddress !== connectedMacAddress
                      );
                    }).length > 0 ? (
                      printers
                        .filter((p) => {
                          const macAddress = p.inner_mac_address?.trim() || "";
                          return (
                            !connectedMacAddress ||
                            macAddress !== connectedMacAddress
                          );
                        })
                        .map((printer) => (
                          <View key={printer.inner_mac_address}>
                            {renderPrinter({ item: printer })}
                          </View>
                        ))
                    ) : (
                      <View style={styles.emptyContainer}>
                        <Ionicons
                          name="cafe-outline"
                          size={64}
                          color={BrandColors.gray[300]}
                        />
                        <Text style={styles.emptyText}>
                          No other printers available
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              )}
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
  modalHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  refreshButton: {
    padding: Spacing.sm,
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
  },
  itemCardConnected: {
    backgroundColor: BrandColors.primary + "10",
    borderWidth: 2,
    borderColor: BrandColors.primary,
  },
  itemPrimaryButtonConnected: {
    backgroundColor: BrandColors.primary + "30",
  },
  connectedBadge: {
    fontSize: FontSizes.sm,
    color: BrandColors.primary,
    fontWeight: "600",
    marginTop: Spacing.xs,
  },
  modalSection: {
    marginBottom: Spacing.lg,
  },
  modalSectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: BrandColors.gray[900],
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: BrandColors.gray[700],
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: BrandColors.gray[300],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: BrandColors.gray[900],
    backgroundColor: BrandColors.gray[50],
  },
});
