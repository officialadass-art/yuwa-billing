import {
    BorderRadius,
    BrandColors,
    FontSizes,
    Spacing,
} from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DATE_FILTERS = [
  "Today",
  "Yesterday",
  "This week",
  "Last week",
  "This month",
  "Last Month",
  "This year",
  "Last Year",
  "Custom",
];

const mockBills = [
  {
    id: "101",
    total: 1200,
    items: 3,
    date: "2026-02-14 10:30 AM",
    status: "Paid",
  },
  {
    id: "102",
    total: 450,
    items: 1,
    date: "2026-02-14 11:15 AM",
    status: "Paid",
  },
  {
    id: "103",
    total: 890,
    items: 4,
    date: "2026-02-14 12:45 PM",
    status: "Paid",
  },
  {
    id: "104",
    total: 230,
    items: 2,
    date: "2026-02-14 02:10 PM",
    status: "Paid",
  },
];

export default function AllBillsScreen() {
  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    if (filter !== "Custom") {
      setShowFilterModal(false);
    }
  };

  const applyCustomFilter = () => {
    setShowFilterModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Bills</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={20} color={BrandColors.primary} />
          <Text style={styles.filterText}>{selectedFilter}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {mockBills.map((bill) => (
          <View key={bill.id} style={styles.billCard}>
            <View style={styles.billIcon}>
              <Ionicons
                name="document-text"
                size={24}
                color={BrandColors.primary}
              />
            </View>
            <View style={styles.billInfo}>
              <Text style={styles.billTitle}>Bill #{bill.id}</Text>
              <Text style={styles.billDate}>{bill.date}</Text>
              <Text style={styles.billItems}>{bill.items} items</Text>
            </View>
            <View style={styles.billAmountContainer}>
              <Text style={styles.billAmount}>₹{bill.total}</Text>
              <Text style={styles.billStatus}>{bill.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Range</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={BrandColors.gray[600]}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterList}>
              {DATE_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={styles.filterOption}
                  onPress={() => handleFilterSelect(filter)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFilter === filter && styles.filterOptionActive,
                    ]}
                  >
                    {filter}
                  </Text>
                  {selectedFilter === filter && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={BrandColors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}

              {selectedFilter === "Custom" && (
                <View style={styles.customDateContainer}>
                  <Text style={styles.inputLabel}>From Date (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.input}
                    value={fromDate}
                    onChangeText={setFromDate}
                    placeholder="2026-01-01"
                  />
                  <Text style={styles.inputLabel}>To Date (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.input}
                    value={toDate}
                    onChangeText={setToDate}
                    placeholder="2026-12-31"
                  />
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={applyCustomFilter}
                  >
                    <Text style={styles.applyButtonText}>Apply Filter</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: BrandColors.white,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.gray[200],
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: BrandColors.gray[900],
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.primary + "15",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  filterText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: BrandColors.primary,
  },
  listContainer: {
    padding: Spacing.lg,
  },
  billCard: {
    flexDirection: "row",
    backgroundColor: BrandColors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    alignItems: "center",
    shadowColor: BrandColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  billIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: BrandColors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  billInfo: {
    flex: 1,
  },
  billTitle: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: BrandColors.gray[900],
  },
  billDate: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[500],
    marginTop: 2,
  },
  billItems: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[500],
  },
  billAmountContainer: {
    alignItems: "flex-end",
  },
  billAmount: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: BrandColors.gray[900],
  },
  billStatus: {
    fontSize: FontSizes.xs,
    color: BrandColors.success,
    fontWeight: "600",
    marginTop: 4,
    backgroundColor: BrandColors.success + "15",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: BrandColors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "80%",
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
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: BrandColors.gray[900],
  },
  filterList: {
    padding: Spacing.lg,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.gray[100],
  },
  filterOptionText: {
    fontSize: FontSizes.md,
    color: BrandColors.gray[700],
  },
  filterOptionActive: {
    color: BrandColors.primary,
    fontWeight: "600",
  },
  customDateContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: BrandColors.gray[50],
    borderRadius: BorderRadius.lg,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[700],
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: BrandColors.white,
    borderWidth: 1,
    borderColor: BrandColors.gray[300],
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: FontSizes.md,
  },
  applyButton: {
    backgroundColor: BrandColors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  applyButtonText: {
    color: BrandColors.white,
    fontWeight: "600",
    fontSize: FontSizes.md,
  },
});
