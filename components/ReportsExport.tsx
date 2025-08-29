import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  X,
  Filter,
  Share,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';

type ReportType = 'sales' | 'reservations' | 'staff' | 'menu' | 'customer';
type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

type Report = {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  icon: any;
  color: string;
  lastGenerated?: string;
  size?: string;
};

const availableReports: Report[] = [
  {
    id: '1',
    type: 'sales',
    title: 'Sales Report',
    description: 'Revenue, transactions, and payment analytics',
    icon: DollarSign,
    color: colors.success,
    lastGenerated: '2 hours ago',
    size: '2.4 MB',
  },
  {
    id: '2',
    type: 'reservations',
    title: 'Reservations Report',
    description: 'Booking trends, cancellations, and occupancy',
    icon: Calendar,
    color: colors.primary,
    lastGenerated: '1 day ago',
    size: '1.8 MB',
  },
  {
    id: '3',
    type: 'staff',
    title: 'Staff Performance',
    description: 'Work hours, productivity, and scheduling',
    icon: Users,
    color: colors.secondary,
    lastGenerated: '3 days ago',
    size: '1.2 MB',
  },
  {
    id: '4',
    type: 'menu',
    title: 'Menu Analytics',
    description: 'Popular items, pricing, and inventory',
    icon: BarChart3,
    color: colors.warning,
    lastGenerated: '1 week ago',
    size: '3.1 MB',
  },
  {
    id: '5',
    type: 'customer',
    title: 'Customer Insights',
    description: 'Demographics, preferences, and feedback',
    icon: PieChart,
    color: colors.accent,
    lastGenerated: '5 days ago',
    size: '2.7 MB',
  },
];

interface ReportsExportProps {
  visible: boolean;
  onClose: () => void;
}

export default function ReportsExport({ visible, onClose }: ReportsExportProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('monthly');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const handleReportToggle = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleGenerateReports = () => {
    if (selectedReports.length === 0) {
      Alert.alert('No Reports Selected', 'Please select at least one report to generate.');
      return;
    }

    Alert.alert(
      'Generate Reports',
      `Generate ${selectedReports.length} report(s) for ${selectedPeriod} period?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            console.log('Generating reports:', selectedReports, selectedPeriod);
            Alert.alert('Success', 'Reports are being generated. You will receive an email when ready.');
            onClose();
          },
        },
      ]
    );
  };

  const handleQuickExport = (report: Report) => {
    Alert.alert(
      'Export Report',
      `Export ${report.title} for ${selectedPeriod} period?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            console.log('Exporting report:', report.id, selectedPeriod);
            Alert.alert('Success', `${report.title} exported successfully.`);
          },
        },
      ]
    );
  };

  const PeriodButton = ({ period, label }: { period: ReportPeriod; label: string }) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === period && styles.periodButtonActive,
      ]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text
        style={[
          styles.periodButtonText,
          selectedPeriod === period && styles.periodButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ReportCard = ({ report }: { report: Report }) => {
    const isSelected = selectedReports.includes(report.id);
    const Icon = report.icon;

    return (
      <TouchableOpacity
        style={[
          styles.reportCard,
          isSelected && styles.reportCardSelected,
          { borderLeftColor: report.color },
        ]}
        onPress={() => handleReportToggle(report.id)}
        activeOpacity={0.8}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportLeft}>
            <View style={[styles.reportIcon, { backgroundColor: report.color + '15' }]}>
              <Icon size={24} color={report.color} strokeWidth={2.5} />
            </View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
              {report.lastGenerated && (
                <Text style={styles.reportMeta}>
                  Last generated: {report.lastGenerated} • {report.size}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.reportActions}>
            <TouchableOpacity
              style={styles.quickExportButton}
              onPress={() => handleQuickExport(report)}
            >
              <Download size={16} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={[
              styles.checkbox,
              isSelected && styles.checkboxSelected,
              { borderColor: report.color },
            ]}>
              {isSelected && (
                <View style={[styles.checkmark, { backgroundColor: report.color }]} />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <FileText size={24} color={colors.primary} strokeWidth={2.5} />
            <Text style={styles.title}>Reports & Export</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color={colors.textLight} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.textLight} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.periodSelector}>
          <Text style={styles.sectionTitle}>Report Period</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.periodButtons}
          >
            <PeriodButton period="daily" label="Daily" />
            <PeriodButton period="weekly" label="Weekly" />
            <PeriodButton period="monthly" label="Monthly" />
            <PeriodButton period="yearly" label="Yearly" />
            <PeriodButton period="custom" label="Custom Range" />
          </ScrollView>
        </View>

        <View style={styles.selectionSummary}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryText}>
              {selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected
            </Text>
            <Text style={styles.summarySubtext}>
              Period: {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
            </Text>
          </View>
          {selectedReports.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSelectedReports([])}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.reportsList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Available Reports</Text>
          {availableReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}

          <View style={styles.exportOptions}>
            <Text style={styles.sectionTitle}>Export Options</Text>
            <View style={styles.optionsGrid}>
              <TouchableOpacity style={styles.optionCard}>
                <FileText size={20} color={colors.primary} strokeWidth={2.5} />
                <Text style={styles.optionText}>PDF Format</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionCard}>
                <BarChart3 size={20} color={colors.success} strokeWidth={2.5} />
                <Text style={styles.optionText}>Excel Format</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionCard}>
                <Share size={20} color={colors.warning} strokeWidth={2.5} />
                <Text style={styles.optionText}>Email Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionCard}>
                <TrendingUp size={20} color={colors.secondary} strokeWidth={2.5} />
                <Text style={styles.optionText}>Dashboard View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.generateButton,
              selectedReports.length === 0 && styles.generateButtonDisabled,
            ]}
            onPress={handleGenerateReports}
            disabled={selectedReports.length === 0}
          >
            <Download size={20} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.generateButtonText}>
              Generate {selectedReports.length > 0 ? `${selectedReports.length} ` : ''}Reports
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.small,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
  },
  periodSelector: {
    backgroundColor: colors.white,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  periodButtons: {
    paddingHorizontal: 24,
    gap: 12,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  periodButtonTextActive: {
    color: colors.white,
  },
  selectionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  summarySubtext: {
    fontSize: 14,
    color: colors.textLight,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.error + '15',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
  },
  reportsList: {
    flex: 1,
    paddingTop: 20,
  },
  reportCard: {
    backgroundColor: colors.white,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    ...shadows.card,
    elevation: 6,
  },
  reportCardSelected: {
    backgroundColor: colors.primary + '05',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 6,
  },
  reportMeta: {
    fontSize: 12,
    color: colors.textExtraLight,
    fontWeight: '500',
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickExportButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: 'transparent',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  exportOptions: {
    marginTop: 20,
    paddingBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    ...shadows.small,
    elevation: 3,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    ...shadows.button,
    elevation: 8,
  },
  generateButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});