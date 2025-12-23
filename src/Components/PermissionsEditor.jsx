import React from "react";

const PermissionsEditor = ({
  permissions,
  setPermissions,
  handlePermissions,
}) => {
  const permissionModules = [
    {
      title: "Actions",
      items: [
        { key: "edit-test-interview", label: "User can edit Test Interview" },
        { key: "edit-medical-test", label: "User can edit Medical Test" },
        { key: "edit-e-number", label: "User can edit E Number" },
        { key: "edit-submission", label: "User can edit Submission" },
        { key: "edit-visa-stamped", label: "User can edit Visa Stamped" },
        { key: "edit-nadra", label: "User can edit Nadra" },
        { key: "edit-protector", label: "User can edit Protector" },
        { key: "edit-flight", label: "User can edit Flight" },
        { key: "edit-departed", label: "User can edit Departed" },
        { key: "go-back", label: "User can go back" },
        { key: "edit-job-prices", label: "User can edit Job prices" },
      ],
    },
    {
      title: "Configuration",
      subModules: [
        {
          title: "Configuration",
          items: [
            { key: "configuration-view", label: "View" },
            { key: "configuration-add", label: "Add" },
            { key: "configuration-edit", label: "Edit" },
            { key: "configuration-delete", label: "Delete" },
            { key: "configuration-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Add Options",
          items: [
            { key: "add-options-view", label: "View" },
            { key: "add-options-add", label: "Add" },
            { key: "add-options-edit", label: "Edit" },
            { key: "add-options-delete", label: "Delete" },
            { key: "add-options-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Age Ranges",
          items: [
            { key: "age-ranges-view", label: "View" },
            { key: "age-ranges-add", label: "Add" },
            { key: "age-ranges-edit", label: "Edit" },
            { key: "age-ranges-delete", label: "Delete" },
            { key: "age-ranges-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Salary Ranges",
          items: [
            { key: "salary-ranges-view", label: "View" },
            { key: "salary-ranges-add", label: "Add" },
            { key: "salary-ranges-edit", label: "Edit" },
            { key: "salary-ranges-delete", label: "Delete" },
            { key: "salary-ranges-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Experience Ranges",
          items: [
            { key: "experience-ranges-view", label: "View" },
            { key: "experience-ranges-add", label: "Add" },
            { key: "experience-ranges-edit", label: "Edit" },
            { key: "experience-ranges-delete", label: "Delete" },
            { key: "experience-ranges-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Airlines",
          items: [
            { key: "airlines-view", label: "View" },
            { key: "airlines-add", label: "Add" },
            { key: "airlines-edit", label: "Edit" },
            { key: "airlines-delete", label: "Delete" },
            { key: "airlines-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Visa Profession",
          items: [
            { key: "visa-profession-view", label: "View" },
            { key: "visa-profession-add", label: "Add" },
            { key: "visa-profession-edit", label: "Edit" },
            { key: "visa-profession-delete", label: "Delete" },
            { key: "visa-profession-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Sectors Industries",
          items: [
            { key: "sectors-industries-view", label: "View" },
            { key: "sectors-industries-add", label: "Add" },
            { key: "sectors-industries-edit", label: "Edit" },
            { key: "sectors-industries-delete", label: "Delete" },
            { key: "sectors-industries-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Skills",
          items: [
            { key: "skills-view", label: "View" },
            { key: "skills-add", label: "Add" },
            { key: "skills-edit", label: "Edit" },
            { key: "skills-delete", label: "Delete" },
            { key: "skills-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Cities",
          items: [
            { key: "cities-view", label: "View" },
            { key: "cities-add", label: "Add" },
            { key: "cities-edit", label: "Edit" },
            { key: "cities-delete", label: "Delete" },
            { key: "cities-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Education Level",
          items: [
            { key: "education-level-view", label: "View" },
            { key: "education-level-add", label: "Add" },
            { key: "education-level-edit", label: "Edit" },
            { key: "education-level-delete", label: "Delete" },
            { key: "education-level-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Career Level",
          items: [
            { key: "career-level-view", label: "View" },
            { key: "career-level-add", label: "Add" },
            { key: "career-level-edit", label: "Edit" },
            { key: "career-level-delete", label: "Delete" },
            { key: "career-level-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Add Payment Agent",
          items: [
            { key: "add-payment-agent-view", label: "View" },
            { key: "add-payment-agent-add", label: "Add" },
            { key: "add-payment-agent-edit", label: "Edit" },
            { key: "add-payment-agent-delete", label: "Delete" },
            { key: "add-payment-agent-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Add Recruitment Agent",
          items: [
            { key: "add-recruitment-agent-view", label: "View" },
            { key: "add-recruitment-agent-add", label: "Add" },
            { key: "add-recruitment-agent-edit", label: "Edit" },
            { key: "add-recruitment-agent-delete", label: "Delete" },
            { key: "add-recruitment-agent-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Add Travel Agent",
          items: [
            { key: "add-travel-agent-view", label: "View" },
            { key: "add-travel-agent-add", label: "Add" },
            { key: "add-travel-agent-edit", label: "Edit" },
            { key: "add-travel-agent-delete", label: "Delete" },
            { key: "add-travel-agent-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Visa Categories",
          items: [
            { key: "visa-categories-view", label: "View" },
            { key: "visa-categories-add", label: "Add" },
            { key: "visa-categories-edit", label: "Edit" },
            { key: "visa-categories-delete", label: "Delete" },
            { key: "visa-categories-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Education Categories",
          items: [
            { key: "education-categories-view", label: "View" },
            { key: "education-categories-add", label: "Add" },
            { key: "education-categories-edit", label: "Edit" },
            { key: "education-categories-delete", label: "Delete" },
            { key: "education-categories-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Job Categories",
          items: [
            { key: "job-categories-view", label: "View" },
            { key: "job-categories-add", label: "Add" },
            { key: "job-categories-edit", label: "Edit" },
            { key: "job-categories-delete", label: "Delete" },
            { key: "job-categories-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Sub Categories",
          items: [
            { key: "sub-categories-view", label: "View" },
            { key: "sub-categories-add", label: "Add" },
            { key: "sub-categories-edit", label: "Edit" },
            { key: "sub-categories-delete", label: "Delete" },
            { key: "sub-categories-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Working Categories",
          items: [
            { key: "working-categories-view", label: "View" },
            { key: "working-categories-add", label: "Add" },
            { key: "working-categories-edit", label: "Edit" },
            { key: "working-categories-delete", label: "Delete" },
            { key: "working-categories-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Visa Issuing Authorities",
          items: [
            { key: "visa-issuing-authorities-view", label: "View" },
            { key: "visa-issuing-authorities-add", label: "Add" },
            { key: "visa-issuing-authorities-edit", label: "Edit" },
            { key: "visa-issuing-authorities-delete", label: "Delete" },
            { key: "visa-issuing-authorities-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Verifying Institutions",
          items: [
            { key: "verifying-institutions-view", label: "View" },
            { key: "verifying-institutions-add", label: "Add" },
            { key: "verifying-institutions-edit", label: "Edit" },
            { key: "verifying-institutions-delete", label: "Delete" },
            { key: "verifying-institutions-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Add Test Center",
          items: [
            { key: "add-test-center-view", label: "View" },
            { key: "add-test-center-add", label: "Add" },
            { key: "add-test-center-edit", label: "Edit" },
            { key: "add-test-center-delete", label: "Delete" },
            { key: "add-test-center-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Add Medical Centers",
          items: [
            { key: "add-medical-centers-view", label: "View" },
            { key: "add-medical-centers-add", label: "Add" },
            { key: "add-medical-centers-edit", label: "Edit" },
            { key: "add-medical-centers-delete", label: "Delete" },
            { key: "add-medical-centers-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Add Test Types",
          items: [
            { key: "add-test-types-view", label: "View" },
            { key: "add-test-types-add", label: "Add" },
            { key: "add-test-types-edit", label: "Edit" },
            { key: "add-test-types-delete", label: "Delete" },
            { key: "add-test-types-authorize", label: "Authorize" },
          ],
        },
      ],
    },
    {
      title: "Candidate Management",
      subModules: [
        {
          title: "Candidate Management",
          items: [
            { key: "candidate-management-view", label: "View" },
            { key: "candidate-management-add", label: "Add" },
            { key: "candidate-management-edit", label: "Edit" },
            { key: "candidate-management-delete", label: "Delete" },
            { key: "candidate-management-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Initial Registration",
          items: [
            { key: "initial-registration-view", label: "View" },
            { key: "initial-registration-add", label: "Add" },
            { key: "initial-registration-edit", label: "Edit" },
            { key: "initial-registration-delete", label: "Delete" },
            { key: "initial-registration-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Candidate Final Registration",
          items: [
            { key: "candidate-final-registration-view", label: "View" },
            { key: "candidate-final-registration-add", label: "Add" },
            { key: "candidate-final-registration-edit", label: "Edit" },
            { key: "candidate-final-registration-delete", label: "Delete" },
            {
              key: "candidate-final-registration-authorize",
              label: "Authorize",
            },
          ],
        },
        {
          title: "Apply Job",
          items: [
            { key: "apply-job-view", label: "View" },
            { key: "apply-job-add", label: "Add" },
            { key: "apply-job-edit", label: "Edit" },
            { key: "apply-job-delete", label: "Delete" },
            { key: "apply-job-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Shortlisting",
          items: [
            { key: "shortlisting-view", label: "View" },
            { key: "shortlisting-add", label: "Add" },
            { key: "shortlisting-edit", label: "Edit" },
            { key: "shortlisting-delete", label: "Delete" },
            { key: "shortlisting-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Shortlisted Candidates",
          items: [
            { key: "shortlisted-candidates-view", label: "View" },
            { key: "shortlisted-candidates-add", label: "Add" },
            { key: "shortlisted-candidates-edit", label: "Edit" },
            { key: "shortlisted-candidates-delete", label: "Delete" },
            { key: "shortlisted-candidates-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Online Applications",
          items: [
            { key: "online-applications-view", label: "View" },
            { key: "online-applications-add", label: "Add" },
            { key: "online-applications-edit", label: "Edit" },
            { key: "online-applications-delete", label: "Delete" },
            { key: "online-applications-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Job Applications",
          items: [
            { key: "job-applications-view", label: "View" },
            { key: "job-applications-add", label: "Add" },
            { key: "job-applications-edit", label: "Edit" },
            { key: "job-applications-delete", label: "Delete" },
            { key: "job-applications-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Report Manager CM",
          items: [
            { key: "report-manager-cm-view", label: "View" },
            { key: "report-manager-cm-add", label: "Add" },
            { key: "report-manager-cm-edit", label: "Edit" },
            { key: "report-manager-cm-delete", label: "Delete" },
            { key: "report-manager-cm-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Candidate Ledger Expenses",
          items: [
            { key: "candidate-ledger-expenses-view", label: "View" },
            { key: "candidate-ledger-expenses-add", label: "Add" },
            { key: "candidate-ledger-expenses-edit", label: "Edit" },
            { key: "candidate-ledger-expenses-delete", label: "Delete" },
            { key: "candidate-ledger-expenses-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Candidate Ledger Summary",
          items: [
            { key: "candidate-ledger-summary-view", label: "View" },
            { key: "candidate-ledger-summary-add", label: "Add" },
            { key: "candidate-ledger-summary-edit", label: "Edit" },
            { key: "candidate-ledger-summary-delete", label: "Delete" },
            { key: "candidate-ledger-summary-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Candidate Agent Ledger",
          items: [
            { key: "candidate-agent-ledger-view", label: "View" },
            { key: "candidate-agent-ledger-add", label: "Add" },
            { key: "candidate-agent-ledger-edit", label: "Edit" },
            { key: "candidate-agent-ledger-delete", label: "Delete" },
            { key: "candidate-agent-ledger-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Protector Print Candidates",
          items: [
            { key: "protector-print-candidates-view", label: "View" },
            { key: "protector-print-candidates-add", label: "Add" },
            { key: "protector-print-candidates-edit", label: "Edit" },
            { key: "protector-print-candidates-delete", label: "Delete" },
            { key: "protector-print-candidates-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Candidate Filter Report",
          items: [
            { key: "candidate-filter-report-view", label: "View" },
            { key: "candidate-filter-report-add", label: "Add" },
            { key: "candidate-filter-report-edit", label: "Edit" },
            { key: "candidate-filter-report-delete", label: "Delete" },
            { key: "candidate-filter-report-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Traveled Candidates Report",
          items: [
            { key: "traveled-candidates-report-view", label: "View" },
            { key: "traveled-candidates-report-add", label: "Add" },
            { key: "traveled-candidates-report-edit", label: "Edit" },
            { key: "traveled-candidates-report-delete", label: "Delete" },
            { key: "traveled-candidates-report-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Candidate Application Status Report",
          items: [
            { key: "candidate-application-status-report-view", label: "View" },
            { key: "candidate-application-status-report-add", label: "Add" },
            { key: "candidate-application-status-report-edit", label: "Edit" },
            {
              key: "candidate-application-status-report-delete",
              label: "Delete",
            },
            {
              key: "candidate-application-status-report-authorize",
              label: "Authorize",
            },
          ],
        },
        {
          title: "Freeze Applications",
          items: [
            { key: "freeze-applications-view", label: "View" },
            { key: "freeze-applications-add", label: "Add" },
            { key: "freeze-applications-edit", label: "Edit" },
            { key: "freeze-applications-delete", label: "Delete" },
            { key: "freeze-applications-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Completed Applications",
          items: [
            { key: "completed-applications-view", label: "View" },
            { key: "completed-applications-add", label: "Add" },
            { key: "completed-applications-edit", label: "Edit" },
            { key: "completed-applications-delete", label: "Delete" },
            { key: "completed-applications-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Interview Schedule",
          items: [
            { key: "interview-schedule-view", label: "View" },
            { key: "interview-schedule-add", label: "Add" },
            { key: "interview-schedule-edit", label: "Edit" },
            { key: "interview-schedule-delete", label: "Delete" },
            { key: "interview-schedule-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Bulk Application Maker",
          items: [
            { key: "bulk-application-maker-view", label: "View" },
            { key: "bulk-application-maker-add", label: "Add" },
            { key: "bulk-application-maker-edit", label: "Edit" },
            { key: "bulk-application-maker-delete", label: "Delete" },
            { key: "bulk-application-maker-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Bulk Offer Sender",
          items: [
            { key: "bulk-offer-sender-view", label: "View" },
            { key: "bulk-offer-sender-add", label: "Add" },
            { key: "bulk-offer-sender-edit", label: "Edit" },
            { key: "bulk-offer-sender-delete", label: "Delete" },
            { key: "bulk-offer-sender-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Bulk Flight Cancel",
          items: [
            { key: "bulk-flight-cancel-view", label: "View" },
            { key: "bulk-flight-cancel-add", label: "Add" },
            { key: "bulk-flight-cancel-edit", label: "Edit" },
            { key: "bulk-flight-cancel-delete", label: "Delete" },
            { key: "bulk-flight-cancel-authorize", label: "Authorize" },
          ],
        },
      ],
    },
    {
      title: "Accounting & Finance",
      subModules: [
        {
          title: "Accounting Finance",
          items: [
            { key: "accounting-finance-view", label: "View" },
            { key: "accounting-finance-add", label: "Add" },
            { key: "accounting-finance-edit", label: "Edit" },
            { key: "accounting-finance-delete", label: "Delete" },
            { key: "accounting-finance-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Chart of Accounts",
          items: [
            { key: "chart-of-accounts-view", label: "View" },
            { key: "chart-of-accounts-add", label: "Add" },
            { key: "chart-of-accounts-edit", label: "Edit" },
            { key: "chart-of-accounts-delete", label: "Delete" },
            { key: "chart-of-accounts-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Manage Payments",
          items: [
            { key: "manage-payments-view", label: "View" },
            { key: "manage-payments-add", label: "Add" },
            { key: "manage-payments-edit", label: "Edit" },
            { key: "manage-payments-delete", label: "Delete" },
            { key: "manage-payments-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Job Payment",
          items: [
            { key: "job-payment-view", label: "View" },
            { key: "job-payment-add", label: "Add" },
            { key: "job-payment-edit", label: "Edit" },
            { key: "job-payment-delete", label: "Delete" },
            { key: "job-payment-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Travel Agent Payment",
          items: [
            { key: "travel-agent-payment-view", label: "View" },
            { key: "travel-agent-payment-add", label: "Add" },
            { key: "travel-agent-payment-edit", label: "Edit" },
            { key: "travel-agent-payment-delete", label: "Delete" },
            { key: "travel-agent-payment-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Candidate Receipt",
          items: [
            { key: "candidate-receipt-view", label: "View" },
            { key: "candidate-receipt-add", label: "Add" },
            { key: "candidate-receipt-edit", label: "Edit" },
            { key: "candidate-receipt-delete", label: "Delete" },
            { key: "candidate-receipt-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Candidate JV",
          items: [
            { key: "candidate-jv-view", label: "View" },
            { key: "candidate-jv-add", label: "Add" },
            { key: "candidate-jv-edit", label: "Edit" },
            { key: "candidate-jv-delete", label: "Delete" },
            { key: "candidate-jv-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Expenses Against Candidate",
          items: [
            { key: "expenses-against-candidate-view", label: "View" },
            { key: "expenses-against-candidate-add", label: "Add" },
            { key: "expenses-against-candidate-edit", label: "Edit" },
            { key: "expenses-against-candidate-delete", label: "Delete" },
            { key: "expenses-against-candidate-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Opening Balance",
          items: [
            { key: "opening-balance-view", label: "View" },
            { key: "opening-balance-add", label: "Add" },
            { key: "opening-balance-edit", label: "Edit" },
            { key: "opening-balance-delete", label: "Delete" },
            { key: "opening-balance-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Cash Receipt",
          items: [
            { key: "cash-receipt-view", label: "View" },
            { key: "cash-receipt-add", label: "Add" },
            { key: "cash-receipt-edit", label: "Edit" },
            { key: "cash-receipt-delete", label: "Delete" },
            { key: "cash-receipt-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Cash Payment",
          items: [
            { key: "cash-payment-view", label: "View" },
            { key: "cash-payment-add", label: "Add" },
            { key: "cash-payment-edit", label: "Edit" },
            { key: "cash-payment-delete", label: "Delete" },
            { key: "cash-payment-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Report Manager AF",
          items: [
            { key: "report-manager-af-view", label: "View" },
            { key: "report-manager-af-add", label: "Add" },
            { key: "report-manager-af-edit", label: "Edit" },
            { key: "report-manager-af-delete", label: "Delete" },
            { key: "report-manager-af-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Chart of Account Balances",
          items: [
            { key: "chart-of-account-balances-view", label: "View" },
            { key: "chart-of-account-balances-add", label: "Add" },
            { key: "chart-of-account-balances-edit", label: "Edit" },
            { key: "chart-of-account-balances-delete", label: "Delete" },
            { key: "chart-of-account-balances-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Cash Book",
          items: [
            { key: "cash-book-view", label: "View" },
            { key: "cash-book-add", label: "Add" },
            { key: "cash-book-edit", label: "Edit" },
            { key: "cash-book-delete", label: "Delete" },
            { key: "cash-book-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Bank Book",
          items: [
            { key: "bank-book-view", label: "View" },
            { key: "bank-book-add", label: "Add" },
            { key: "bank-book-edit", label: "Edit" },
            { key: "bank-book-delete", label: "Delete" },
            { key: "bank-book-authorize", label: "Authorize" },
          ],
        },
        {
          title: "General Ledger",
          items: [
            { key: "general-ledger-view", label: "View" },
            { key: "general-ledger-add", label: "Add" },
            { key: "general-ledger-edit", label: "Edit" },
            { key: "general-ledger-delete", label: "Delete" },
            { key: "general-ledger-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Trial Balance",
          items: [
            { key: "trial-balance-view", label: "View" },
            { key: "trial-balance-add", label: "Add" },
            { key: "trial-balance-edit", label: "Edit" },
            { key: "trial-balance-delete", label: "Delete" },
            { key: "trial-balance-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Account Balances",
          items: [
            { key: "account-balances-view", label: "View" },
            { key: "account-balances-add", label: "Add" },
            { key: "account-balances-edit", label: "Edit" },
            { key: "account-balances-delete", label: "Delete" },
            { key: "account-balances-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Income Statement",
          items: [
            { key: "income-statement-view", label: "View" },
            { key: "income-statement-add", label: "Add" },
            { key: "income-statement-edit", label: "Edit" },
            { key: "income-statement-delete", label: "Delete" },
            { key: "income-statement-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Balance Sheet",
          items: [
            { key: "balance-sheet-view", label: "View" },
            { key: "balance-sheet-add", label: "Add" },
            { key: "balance-sheet-edit", label: "Edit" },
            { key: "balance-sheet-delete", label: "Delete" },
            { key: "balance-sheet-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Cash Flow Statement",
          items: [
            { key: "cash-flow-statement-view", label: "View" },
            { key: "cash-flow-statement-add", label: "Add" },
            { key: "cash-flow-statement-edit", label: "Edit" },
            { key: "cash-flow-statement-delete", label: "Delete" },
            { key: "cash-flow-statement-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Equity Report",
          items: [
            { key: "equity-report-view", label: "View" },
            { key: "equity-report-add", label: "Add" },
            { key: "equity-report-edit", label: "Edit" },
            { key: "equity-report-delete", label: "Delete" },
            { key: "equity-report-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Bank Receipt",
          items: [
            { key: "bank-receipt-view", label: "View" },
            { key: "bank-receipt-add", label: "Add" },
            { key: "bank-receipt-edit", label: "Edit" },
            { key: "bank-receipt-delete", label: "Delete" },
            { key: "bank-receipt-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Bank Payment",
          items: [
            { key: "bank-payment-view", label: "View" },
            { key: "bank-payment-add", label: "Add" },
            { key: "bank-payment-edit", label: "Edit" },
            { key: "bank-payment-delete", label: "Delete" },
            { key: "bank-payment-authorize", label: "Authorize" },
          ],
        },
        {
          title: "JV",
          items: [
            { key: "jv-view", label: "View" },
            { key: "jv-add", label: "Add" },
            { key: "jv-edit", label: "Edit" },
            { key: "jv-delete", label: "Delete" },
            { key: "jv-authorize", label: "Authorize" },
          ],
        },
      ],
    },
    {
      title: "Admin Area",
      subModules: [
        {
          title: "Admin Area",
          items: [
            { key: "admin-area-view", label: "View" },
            { key: "admin-area-add", label: "Add" },
            { key: "admin-area-edit", label: "Edit" },
            { key: "admin-area-delete", label: "Delete" },
            { key: "admin-area-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Dashboard",
          items: [
            { key: "dashboard-view", label: "View" },
            { key: "dashboard-add", label: "Add" },
            { key: "dashboard-edit", label: "Edit" },
            { key: "dashboard-delete", label: "Delete" },
            { key: "dashboard-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Manage Users",
          items: [
            { key: "manage-users-view", label: "View" },
            { key: "manage-users-add", label: "Add" },
            { key: "manage-users-edit", label: "Edit" },
            { key: "manage-users-delete", label: "Delete" },
            { key: "manage-users-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Manage Role",
          items: [
            { key: "manage-role-view", label: "View" },
            { key: "manage-role-add", label: "Add" },
            { key: "manage-role-edit", label: "Edit" },
            { key: "manage-role-delete", label: "Delete" },
            { key: "manage-role-authorize", label: "Authorize" },
          ],
        },
        {
          title: "Report Manager AN",
          items: [
            { key: "report-manager-an-view", label: "View" },
            { key: "report-manager-an-add", label: "Add" },
            { key: "report-manager-an-edit", label: "Edit" },
            { key: "report-manager-an-delete", label: "Delete" },
            { key: "report-manager-an-authorize", label: "Authorize" },
          ],
        },
        {
          title: "User Log Report",
          items: [
            { key: "user-log-report-view", label: "View" },
            { key: "user-log-report-add", label: "Add" },
            { key: "user-log-report-edit", label: "Edit" },
            { key: "user-log-report-delete", label: "Delete" },
            { key: "user-log-report-authorize", label: "Authorize" },
          ],
        },
      ],
    },
    {
      title: "Application Process",
      subModules: [
        {
          title: "Application Process",
          items: [
            { key: "application-process-view", label: "View" },
            { key: "application-process-add", label: "Add" },
            { key: "application-process-edit", label: "Edit" },
            { key: "application-process-delete", label: "Delete" },
            { key: "application-process-authorize", label: "Authorize" },
          ],
        },
        {
          title: "View Details",
          items: [
            { key: "view-details-view", label: "View" },
            { key: "view-details-add", label: "Add" },
            { key: "view-details-edit", label: "Edit" },
            { key: "view-details-delete", label: "Delete" },
            { key: "view-details-authorize", label: "Authorize" },
          ],
        },
      ],
    },
    {
      title: "Employer Management",
      subModules: [
        {
          title: "Employer Management",
          items: [
            { key: "employer-management-view", label: "View" },
            { key: "employer-management-add", label: "Add" },
            { key: "employer-management-edit", label: "Edit" },
            { key: "employer-management-delete", label: "Delete" },
            { key: "employer-management-authorize", label: "Authorize" },
          ],
        },
      ],
    },
  ];

  const handlePermissionChange = (key, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleAllowAll = (moduleTitle, items, checked) => {
    setPermissions((prev) => {
      const newPermissions = { ...prev };
      items.forEach((item) => {
        newPermissions[item.key] = checked;
      });
      return newPermissions;
    });
  };

  const isAllSelected = (items) => {
    return items.every((item) => permissions[item.key]);
  };

  const renderModule = (module) => {
    if (module.subModules) {
      return (
        <div key={module.title} className="mb-6">
          <h3 className="text-lg font-semibold mb-4">{module.title}</h3>
          {module.subModules.map((subModule) => {
            const allItems = subModule.items;
            return (
              <div key={subModule.title} className="mb-4 ml-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium">{subModule.title}</h4>
                  <label className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                    <input
                      type="checkbox"
                      checked={isAllSelected(allItems)}
                      onChange={(e) =>
                        handleAllowAll(
                          subModule.title,
                          allItems,
                          e.target.checked
                        )
                      }
                      className="form-checkbox"
                    />
                    <span className="text-sm font-medium text-blue-700">
                      Allow All
                    </span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {subModule.items.map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={permissions[item.key] || false}
                        onChange={(e) =>
                          handlePermissionChange(item.key, e.target.checked)
                        }
                        className="form-checkbox"
                      />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      const allItems = module.items;
      return (
        <div key={module.title} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{module.title}</h3>
            <label className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded border border-blue-200">
              <input
                type="checkbox"
                checked={isAllSelected(allItems)}
                onChange={(e) =>
                  handleAllowAll(module.title, allItems, e.target.checked)
                }
                className="form-checkbox"
              />
              <span className="text-sm font-medium text-blue-700">
                Allow All
              </span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {module.items.map((item) => (
              <label key={item.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={permissions[item.key] || false}
                  onChange={(e) =>
                    handlePermissionChange(item.key, e.target.checked)
                  }
                  className="form-checkbox"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="permissions-editor p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Permissions Editor</h2>
      {permissionModules.map(renderModule)}
      <div className="mt-6">
        <button
          onClick={handlePermissions}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
};

export default PermissionsEditor;
