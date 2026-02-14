import {
    BorderRadius,
    BrandColors,
    FontSizes,
    Spacing,
} from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Mock data for dashboard
const todayStats = {
  totalSales: 15680,
  totalOrders: 42,
  avgOrderValue: 373,
  topItem: "Cappuccino",
};

const recentOrders = [
  { id: "1", items: 3, total: 520, time: "2 min ago", status: "completed" },
  { id: "2", items: 2, total: 340, time: "15 min ago", status: "completed" },
  { id: "3", items: 5, total: 890, time: "32 min ago", status: "completed" },
  { id: "4", items: 1, total: 180, time: "1 hr ago", status: "completed" },
];

export default function DashboardScreen() {
  const { currentBusiness } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={BrandColors.primary}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.businessName}>
              {currentBusiness?.name || "CafeBill"}
            </Text>
            <Text style={styles.dateText}>Today, Feb 14, 2026</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={BrandColors.white}
            />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statsCard, styles.primaryCard]}>
            <View style={styles.statsIconContainer}>
              <Ionicons
                name="cash-outline"
                size={24}
                color={BrandColors.white}
              />
            </View>
            <Text style={styles.statsValue}>
              ₹{todayStats.totalSales.toLocaleString()}
            </Text>
            <Text style={styles.statsLabel}>Today's Sales</Text>
          </View>

          <View style={styles.statsCard}>
            <View style={[styles.statsIconContainer, styles.accentIcon]}>
              <Ionicons
                name="receipt-outline"
                size={24}
                color={BrandColors.accent}
              />
            </View>
            <Text style={styles.statsValueDark}>{todayStats.totalOrders}</Text>
            <Text style={styles.statsLabelDark}>Orders</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <View style={[styles.statsIconContainer, styles.successIcon]}>
              <Ionicons
                name="trending-up-outline"
                size={24}
                color={BrandColors.success}
              />
            </View>
            <Text style={styles.statsValueDark}>
              ₹{todayStats.avgOrderValue}
            </Text>
            <Text style={styles.statsLabelDark}>Avg. Order</Text>
          </View>

          <View style={styles.statsCard}>
            <View style={[styles.statsIconContainer, styles.infoIcon]}>
              <Ionicons
                name="star-outline"
                size={24}
                color={BrandColors.info}
              />
            </View>
            <Text style={styles.statsValueDark}>{todayStats.topItem}</Text>
            <Text style={styles.statsLabelDark}>Top Seller</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: BrandColors.primary + "15" },
                ]}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={28}
                  color={BrandColors.primary}
                />
              </View>
              <Text style={styles.actionText}>New Bill</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: BrandColors.accent + "15" },
                ]}
              >
                <Ionicons
                  name="list-outline"
                  size={28}
                  color={BrandColors.accent}
                />
              </View>
              <Text style={styles.actionText}>View Bills</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: BrandColors.success + "15" },
                ]}
              >
                <Ionicons
                  name="bar-chart-outline"
                  size={28}
                  color={BrandColors.success}
                />
              </View>
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: BrandColors.info + "15" },
                ]}
              >
                <Ionicons
                  name="settings-outline"
                  size={28}
                  color={BrandColors.info}
                />
              </View>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderIcon}>
                <Ionicons
                  name="receipt"
                  size={20}
                  color={BrandColors.primary}
                />
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderTitle}>Order #{order.id}</Text>
                <Text style={styles.orderMeta}>
                  {order.items} items • {order.time}
                </Text>
              </View>
              <View style={styles.orderAmount}>
                <Text style={styles.orderTotal}>₹{order.total}</Text>
                <View style={styles.statusBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={BrandColors.success}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.gray[50],
  },
  header: {
    backgroundColor: BrandColors.primary,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  businessName: {
    fontSize: FontSizes.xxl,
    fontWeight: "700",
    color: BrandColors.white,
  },
  dateText: {
    fontSize: FontSizes.md,
    color: BrandColors.white + "80",
    marginTop: Spacing.xs,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BrandColors.white + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BrandColors.accent,
    borderWidth: 2,
    borderColor: BrandColors.primary,
  },
  content: {
    flex: 1,
    marginTop: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  statsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statsCard: {
    flex: 1,
    backgroundColor: BrandColors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: BrandColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryCard: {
    backgroundColor: BrandColors.primary,
  },
  statsIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: BrandColors.white + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  accentIcon: {
    backgroundColor: BrandColors.accent + "15",
  },
  successIcon: {
    backgroundColor: BrandColors.success + "15",
  },
  infoIcon: {
    backgroundColor: BrandColors.info + "15",
  },
  statsValue: {
    fontSize: FontSizes.xxl,
    fontWeight: "700",
    color: BrandColors.white,
  },
  statsValueDark: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: BrandColors.gray[900],
  },
  statsLabel: {
    fontSize: FontSizes.sm,
    color: BrandColors.white + "80",
    marginTop: Spacing.xs,
  },
  statsLabelDark: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[600],
    marginTop: Spacing.xs,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: BrandColors.gray[900],
    marginBottom: Spacing.md,
  },
  viewAllText: {
    fontSize: FontSizes.md,
    color: BrandColors.primary,
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  actionButton: {
    width: "22%",
    alignItems: "center",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  actionText: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[700],
    textAlign: "center",
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  orderIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: BrandColors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: BrandColors.gray[900],
  },
  orderMeta: {
    fontSize: FontSizes.sm,
    color: BrandColors.gray[500],
    marginTop: 2,
  },
  orderAmount: {
    alignItems: "flex-end",
  },
  orderTotal: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: BrandColors.gray[900],
  },
  statusBadge: {
    marginTop: Spacing.xs,
  },
});
