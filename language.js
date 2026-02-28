// ===============================================
// SPRÅKSTÖD - SVENSKA OCH ENGELSKA
// ===============================================

let currentLanguage = localStorage.getItem('selectedLanguage') || 'sv';

const translations = {
    sv: {
        // Huvudrubriker
        pageTitle: "TimeGrid",
        subtitle: "Kapacitetsplaneringsverktyg",
        
        // Kontrollpanel
        showPlanningForYear: "Visa planering för år:",
        updateTimeline: "Uppdatera Tidslinje",
        saveToFile: "Spara till fil (JSON)",
        loadFile: "Ladda fil (JSON)",
        deleteAll: "Radera alla uppgifter",
        reportName: "Rapportnamn (t.ex. Team A Beläggning)",
        generateCapacityReport: "Generera Beläggningsrapport",
        generateInterruptionReport: "Generera Avbrottsrapport",
        taskName: "Uppgift (t.ex. P2)",
        hours: "Timmar (Total)",
        placeTask: "Placera uppgift",
        
        // Uppgiftstyper
        project: "Projekt",
        selectProject: "Välj projekt...",
        support: "Support",
        change: "Change Request",
        improvement: "Förbättring",
        rework: "Omarbete",
        lateAddition: "Sent Tillägg",
        eplanMaintenance: "Eplan underhåll",
        
        // Veckodag
        weekdays: ['Sön','Mån','Tis','Ons','Tor','Fre','Lör'],
        
        // Modal för projektplacering
        projectScheduling: "Schemaläggning av projekt",
        howToAllocate: "Hur ska projektet allokeras från startdatumet",
        forward: "Framåt i tiden",
        backward: "Bakåt i tiden",
        cancel: "Avbryt",
        
        // Avbrottslogg
        interruptionLog: "Avbrottslogg",
        addInterruption: "Lägg till avbrott",
        time: "Tid",
        category: "PI/Mail",
        description: "Beskriva ärendet...",
        delete: "Radera",
        totalInterruptions: "Totalt avbrott:",
        
        // Kategorier
        pi: "PI",
        mail: "Mail",
        
        // Mått
        min: "Min",
        max: "Arb.tid",
        capacity: "Mötestid",
        projectTime: "Mötesfri",
        
        // Meddelanden
        allTasksDeleted: "Alla uppgifter och avbrott raderade!",
        confirmDelete: "Vill du radera alla uppgifter från tidslinjen?",
        
        // Kontextmeny
        splitProject: "Dela upp projekt (skapa lucka)",
        
        // Rapporter
        capacityReport: "BELÄGGNINGSRAPPORT",
        capacityPerWeek: "BELÄGGNING PER VECKA",
        dailyCapacity: "DAGLIG BELÄGGNING",
        leadTimePerProject: "LEDTID PER PROJEKT",
        interruptionReport: "AVBROTTSRAPPORT",
        period: "Period",
        workDays: "Arbetsdagar",
        availableHours: "Tillgänglig tid (h)",
        allocatedHours: "Belagd tid (h)",
        capacityPercent: "Beläggning (%)",
        overloadHours: "Överbeläggning (h)",
        plannedHours: "Planerad tid (h)",
        actualHours: "Verklig tid (h)",
        variance: "Avvikelse (h)",
        week: "Vecka",
        date: "Datum",
        weekday: "Veckodag",
        meetings: "Möten (h)",
        interruptions: "Avbrott (h)",
        projects: "Projekt (h)",
        available: "Tillgänglig (h)",
        allocated: "Belagd (h)",
        overload: "Överbeläggning (h)",
        projectName: "Projektnamn",
        startDate: "Startdatum",
        endDate: "Slutdatum",
        type: "Typ",
        leadTimeDays: "Ledtid (dagar)",
        totalPlanned: "Total planerad",
        totalActual: "Total verklig",
        totalVariance: "Total avvikelse",
        totalInterruptionTime: "Total avbrottstid",
        totalWasteTime: "Total slöseri (omarbete, sent tillägg)",
        closeReport: "Stäng rapport",
        exportToCsv: "Exportera till CSV",
        capacityReportTitle: "Beläggningsrapport per vecka",
        capacityByWeek: "Beläggning per vecka",
        graphicalCapacity: "Grafisk Beläggning",
        allocatedTime: "Bokad tid (h)",
        projectShare: "Andel projekttid",
        wasteShare: "Andel slöseri",
        closeAndGoBack: "Stäng & Gå tillbaka",
        exportToExcel: "Exportera till Excel (CSV)",
        reworkLabel: "Omarbete",
        lateAdditionLabel: "Sent tillägg",
        interruptionLabel: "Avbrott",
        to: "till",
        ok: "OK",
        nearMax: "Nära max",
        overloaded: "Överbelastad",
        dailyCapacityTitle: "Daglig beläggning",
        status: "Status",
        waste: "Slöseri (h)",
        projectShareExplanation: "andel av bokad tid som är projekt",
        wasteShareExplanation: "omarbete + sent tillägg + avbrott i förhållande till bokad tid",
        leadTimeVsIdeal: "Ledtid per projekt — faktisk vs ideal",
        leadTimeDescription: "Jämförelse av faktisk ledtid (arbetsdagar) mot ideal om 6 timmar projekttid per dag, samt mål 75% av arbetstiden som projekttid",
        hoursPerDay: "h/dag",
        totalHours: "Timmar totalt",
        actualLeadTimeDays: "Faktisk ledtid (dagar)",
        ideal6hPerDay: "Ideal 6h/dag (dagar)",
        varianceVs6h: "Avvikelse vs 6h",
        ideal75Percent: "Ideal 75% (dagar)",
        varianceVs75: "Avvikelse vs 75%",
        noProjectsFound: "Inga projekt funna för året",
        summary: "Sammanfattning",
        measurement: "Mätning",
        value: "Värde",
        totalInterruptionsPerYear: "Totala avbrott per år",
        avgInterruptionsPerDay: "Genomsnitt avbrott per dag",
        interruptionsByDepartment: "Avbrott per Avdelning",
        department: "Avdelning",
        count: "Antal",
        share: "Andel (%)",
        graph: "Graf",
        interruptionsByContactMethod: "Avbrott per Kontaktmetod",
        method: "Metod",
        interruptionsPerDay: "Avbrott per Dag",
        day: "Dag",
        numInterruptions: "Antal Avbrott",
        details: "Detaljer",
        
        // Avbrottsrapport
        allInterruptions: "Alla avbrott",
        totalHours: "Totalt (h)",
        
        // Kvalitetsförluster
        qualityLossReport: "Kvalitetsförluster per Projekt",
        qualityLossReportSubtitle: "Visar all registrerad tid för kvalitetsförluster kopplat till projekt.",
        noQualityLossesRegistered: "Inga kvalitetsförluster registrerade.",
        totalTime: "Total tid",
        events: "händelser",
        event: "händelse",
        perDepartment: "Per Avdelning",
        perLossType: "Per Förlusttyp",
        showAllEvents: "Visa alla",
        hours: "Timmar",
        percent: "Procent",
        lossType: "Förlusttyp",
        detailedList: "Detaljerad lista",
        reportCreated: "Rapport skapad",
        noProjectSpecified: "Inget projekt angivet",
        unknown: "Okänd",
        distributionPerDepartment: "Fördelning per Avdelning",
        distributionPerLossType: "Fördelning per Förlusttyp",
        qualityLossesPerProject: "Kvalitetsförluster per Projekt",
        enterReportName: "Ange rapportnamn (valfritt):",
        
        // Beläggningsrapport - nya
        yearSummary: "Årssammanfattning",
        availableTime: "Tillgänglig tid",
        usedTime: "Använd tid",
        totalOvertime: "Övertid totalt",
        interruptionsPiMail: "Avbrott (PI/Mail)",
        qualityLoss: "Kvalitetsförlust",
        addQualityLoss: "Lägg till slöseri",
        capacityStatusLegend: "📊 <strong>Grön</strong> = God kapacitet (under 85%) | <strong style='color:#f39c12'>Gul</strong> = Hög belastning (85-100%) | <strong style='color:#e74c3c'>Röd</strong> = Överbelastad (över 100%)",
        otherTasks: "Övriga uppgifter",
        overtime: "Övertid",
        statusOverloaded: "🔴 Överbelastad",
        statusHighLoad: "🟡 Hög belastning",
        statusGoodCapacity: "🟢 God kapacitet",
        dailyCapacityWorkdays: "Daglig kapacitet (arbetsdagar)",
        dailyCapacityDescription: "Visar endast arbetsdagar. <strong>Övertid</strong> = tid utöver normal 8-timmars arbetsdag.",
        supportChange: "Support/Change",
        other: "Övriga",
        statusOk: "🟢 OK",
        statusHigh: "🟡 Hög",
        explanationOfTerms: "💡 Förklaring av begrepp",
        availableTimeExplanation: "Total arbetstid per dag/vecka (inklusive eventuell övertid).",
        
        // Meny
        menuTitle: "Meny",
        capacityReportMenuItem: "📊 Beläggningsrapport",
        interruptionReportMenuItem: "📞 Avbrottsrapport",
        qualityLossReportMenuItem: "⚠️ Kvalitetsförlustrappport",
        colorScheme: "🎨 Färgschema",
        purpleBlue: "Lila-Blå",
        grayBlue: "Grå-Blå",
        greenTeal: "Grön-Turkos",
        orangeRed: "Orange-Röd",
        dark: "Mörk",
        settings: "⚙️ Inställningar",
        licenseMenuItem: "🔑 Licens",
        saveToFileMenu: "💾 Spara till fil",
        loadFileMenu: "📂 Ladda fil",
        userManual: "📘 Användarmanual",
        deleteAllMenu: "🗑 Radera allt",
        usedTimeExplanation: "Summan av all allokerad tid för uppgifter.",
        utilizationExplanation: "Använd tid ÷ Tillgänglig tid × 100%. Visar hur fullt schemat är.",
        overtimeExplanation: "Tid utöver normal 8-timmars arbetsdag.",
        qualityLossExplanation: "Arbete som inte skapar värde = Omarbete + Sent tillägg. <em>Exkluderar avbrott eftersom dessa ofta är legitima arbetsuppgifter (PI, mail).</em>",
        projectCompletion: "Projektgenomförande",
        projectCompletionDescription: "Jämför faktisk genomförandetid med idealiskt scenario (75% av arbetstid = {hours}h/dag).",
        total: "Totalt",
        actualWorkDays: "Faktiska arbetsdagar",
        idealWorkDays75: "Ideal arbetsdagar (75%)",
        completionEfficiency: "Genomförandeeffektivitet",
        interpretation: "Tolkning:",
        greenDeviationExplanation: "• <strong style='color:#27ae60'>Grön avvikelse (negativ)</strong> = Projektet genomfördes snabbare än idealet (bra!)",
        redDeviationExplanation: "• <strong style='color:#e74c3c'>Röd avvikelse (positiv)</strong> = Projektet tog längre tid än idealet (försening)",
        efficiencyExplanation: "• <strong>Genomförandeeffektivitet</strong> = Hur nära idealet projektet kom. 100% = perfekt tempo, under 70% = betydande försening.",
        noProjects: "Inga projekt hittades.",
        
        // CSV export - beläggningsrapport
        csvYearSummary: "ÅRSSAMMANFATTNING",
        availableTimeHours: "Tillgänglig tid (h)",
        usedTimeHours: "Använd tid (h)",
        utilizationPercent: "Beläggning (%)",
        totalOvertimeHours: "Övertid totalt (h)",
        timeDistribution: "FÖRDELNING AV TID",
        projectsHours: "Projekt (h)",
        supportHours: "Support (h)",
        changeHours: "Change (h)",
        improvementHours: "Förbättring (h)",
        eplanHours: "Eplan (h)",
        interruptionsPiMailHours: "Avbrott PI/Mail (h)",
        qualityLossOtherDeptHours: "Kvalitetsförlust från andra avd. (h)",
        csvQualityLoss: "KVALITETSFÖRLUST",
        reworkHours: "Omarbete (h)",
        lateAdditionHours: "Sent tillägg (h)",
        totalQualityLossHours: "Total kvalitetsförlust (h)",
        shareOfTotalTimePercent: "Andel av total tid (%)",
        csvCapacityPerWeek: "BELÄGGNING PER VECKA",
        csvDailyCapacity: "DAGLIG BELÄGGNING",
        csvProjectCompletion: "PROJEKTGENOMFÖRANDE",
        highLoad: "Hög belastning",
        capacityReportExportedToCsv: "Beläggningsrapport (vecka) exporterad till CSV.",
        goodCapacity: "God kapacitet",
        
        // Avbrottsrapport - nya
        totalInterruptionCount: "Totalt antal avbrott",
        totalTimeLost: "Total tid förlorad",
        totalTimeLostHours: "Total tid förlorad (h)",
        totalTimeLostMinutes: "Total tid förlorad (min)",
        interruptionsPerDayAvg: "Avbrott per dag (snitt)",
        timePerDayAvg: "Tid per dag (snitt)",
        timePerDayAvgMin: "Tid per dag (snitt, min)",
        timePerInterruptionAvgMin: "Tid per avbrott (snitt, min)",
        avgTimePerInterruption: "Genomsnittlig tid per avbrott",
        improvementPotential: "💡 Förbättringspotential",
        improvementPotential25: "Förbättringspotential (25% minskning, h)",
        if25PercentReduction: "Om avbrotten minskade med 25%:",
        savedTime: "sparad tid",
        csvInterruptionsPerDepartment: "AVBROTT PER AVDELNING",
        csvInterruptionsPerContactMethod: "AVBROTT PER KONTAKTMETOD",
        contactMethod: "Kontaktmetod",
        csvInterruptionsPerMonth: "AVBROTT PER MÅNAD",
        month: "Månad",
        csvDetailedInterruptionList: "DETALJERAD AVBROTTSLISTA",
        contact: "Kontakt",
        issue: "Ärende",
        interruptionReportExportedToCsv: "Avbrottsrapport exporterad till CSV.",
        interruptionsByDepartmentTitle: "📊 Avbrott per avdelning",
        departmentSectionDescription: "Visar vilka avdelningar som orsakar flest avbrott och hur mycket tid de tar.",
        interruptionCount: "Antal avbrott",
        shareOfTotal: "Andel av totalt",
        totalTimeMin: "Total tid (min)",
        totalTimeHours: "Total tid (h)",
        avgPerInterruptionMin: "Snitt per avbrott (min)",
        distribution: "Fördelning",
        interruptionsByContactMethodTitle: "📱 Avbrott per kontaktmetod",
        contactMethodSectionDescription: "Visar hur avbrott kommer in (telefon, mail, personligen etc).",
        interruptionsByMonthTitle: "📅 Avbrott per månad",
        avgInterruptionsPerDay2: "Snitt avbrott/dag",
        trend: "Trend",
        top10DaysMostInterruptions: "🔝 Top 10 dagar med flest avbrott",
        insightsAndImprovements: "💡 Insikter och förbättringsförslag",
        improvementPotentialLabel: "Förbättringspotential:",
        improvementPotentialText: "Om antalet avbrott reduceras med 25% sparas ca {hours} timmar per år.",
        focusAreas: "Fokusområden:",
        topDepartmentsText: "De tre avdelningar som orsakar flest avbrott står för {percent}% av alla avbrott.",
        contactMethodLabel: "Kontaktmetod:",
        isMostCommonMethod: "är vanligaste kontaktmetoden",
        noData: "Ingen data.",
        explanationOfMetrics: "📊 Förklaring av mätvärden",
        interruptionCountExplanation: "Totalt antal registrerade avbrott under året.",
        totalTimeLostExplanation: "Summan av all tid som spenderats på avbrott (i timmar och minuter).",
        avgPerInterruptionExplanation: "Genomsnittlig tid varje avbrott tar (total tid ÷ antal avbrott).",
        interruptionsPerDayExplanation: "Genomsnittligt antal avbrott per arbetsdag.",
        improvementPotentialExplanation: "Beräknad tid som kan sparas genom att minska avbrott.",
        
        // Språkväxlare
        language: "Språk",
        
        // Nya funktioner - Multi-select, Swap, Offset, etc.
        blocksSelected: "block markerade",
        deleteSelectedBlocks: "Radera markerade block",
        deselectAll: "Avmarkera alla",
        swapWithDay: "Byt plats med annan dag",
        completeSwap: "Byt med denna dag",
        cancelSwap: "Avbryt byte",
        offsetProject: "Förskjut projekt (±dagar)",
        moveToSpecificDate: "Flytta till specifikt datum",
        swapModeActive: "BYTA PLATS: Vald",
        swapModeSelectTarget: "Högerklicka på den dag du vill byta med",
        swapped: "Bytt plats mellan",
        offsetPrompt: "Förskjut projektet",
        offsetPromptDetails: "Ange antal dagar (positivt = framåt, negativt = bakåt):",
        invalidDays: "Ogiltigt antal dagar!",
        projectOffset: "Projektet",
        offsetForward: "förskjutet framåt",
        offsetBackward: "förskjutet bakåt",
        days: "dagar",
        moveToDatePrompt: "Flytta projektet",
        moveToDateDetails: "till specifikt datum\nAnge datum (ÅÅÅÅ-MM-DD):",
        invalidDateFormat: "Ogiltigt datumformat! Använd ÅÅÅÅ-MM-DD (t.ex. 2025-03-15)",
        invalidDate: "Ogiltigt datum!",
        projectMovedTo: "Projektet",
        movedTo: "flyttat till",
        copiedTo: "Kopierade",
        to: "till",
        blocksMoved: "Block flyttade!",
        blocksDeleted: "Block raderade!",
        confirmDeleteBlocks: "Vill du radera",
        markedBlocks: "markerade block?",
        nothingToUndo: "Inget att ångra!",
        undone: "Ångrat!",
        nothingToRedo: "Inget att göra om!",
        redone: "Gjort om!",
        
        // Skapa lucka
        createGap: "Skapa lucka från denna dag",
        createGapPrompt: "Skapa lucka i projektet",
        createGapDetails: "Ange antal dagar för luckan (positiva dagar):",
        invalidGapDays: "Ange ett positivt antal dagar!",
        noAllocationsFound: "Inga allokeringar hittades från",
        andForward: "och framåt för projektet",
        gapCreated: "Lucka på",
        gapCreatedIn: "dagar skapad i projektet",
        from: "från",
        
        // Förenklad projekthantering
        moveBlocksToDate: "Flytta block till nytt datum",
        moveBlocksPrompt: "Flytta markerade block till datum (ÅÅÅÅ-MM-DD):",
        deleteBlocksConfirm: "Vill du radera",
        projectBlocksWillReallocate: "projektblock? Timmarna kommer att allokeras framåt i tiden.",
        projectBlocksDeleted: "projektblock raderade. Timmarna allokeras framåt i projektet.",
        blocksMoved: "block flyttade till",
        andForward: "och framåt!",
        cannotMixTypes: "Du kan inte radera projektblock och andra typer av block samtidigt!"
    },
    en: {
        // Main titles
        pageTitle: "TimeGrid",
        subtitle: "Capacity Planning Tool",
        
        // Control panel
        showPlanningForYear: "Show planning for year:",
        updateTimeline: "Update Timeline",
        saveToFile: "Save to file (JSON)",
        loadFile: "Load file (JSON)",
        deleteAll: "Delete all tasks",
        reportName: "Report name (e.g., Team A Capacity)",
        generateCapacityReport: "Generate Capacity Report",
        generateInterruptionReport: "Generate Interruption Report",
        taskName: "Task (e.g., P2)",
        hours: "Hours (Total)",
        placeTask: "Place task",
        
        // Task types
        project: "Project",
        selectProject: "Select project...",
        support: "Support",
        change: "Change Request",
        improvement: "Improvement",
        rework: "Rework",
        lateAddition: "Late Addition",
        eplanMaintenance: "Eplan Maintenance",
        
        // Weekdays
        weekdays: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        
        // Modal for project placement
        projectScheduling: "Project Scheduling",
        howToAllocate: "How should the project be allocated from the start date",
        forward: "Forward in time",
        backward: "Backward in time",
        cancel: "Cancel",
        
        // Interruption log
        interruptionLog: "Interruption Log",
        addInterruption: "Add interruption",
        time: "Time",
        category: "Call/Email",
        description: "Describe issue...",
        delete: "Delete",
        totalInterruptions: "Total interruptions:",
        
        // Categories
        pi: "Call",
        mail: "Email",
        
        // Measures
        min: "Min",
        max: "Wk hrs",
        capacity: "Meeting time",
        projectTime: "Meeting-free",
        
        // Messages
        allTasksDeleted: "All tasks and interruptions deleted!",
        confirmDelete: "Do you want to delete all tasks from the timeline?",
        
        // Context menu
        splitProject: "Split project (create gap)",
        
        // New features - Multi-select, Swap, Offset, etc.
        blocksSelected: "blocks selected",
        deleteSelectedBlocks: "Delete selected blocks",
        deselectAll: "Deselect all",
        swapWithDay: "Swap with another day",
        completeSwap: "Swap with this day",
        cancelSwap: "Cancel swap",
        offsetProject: "Offset project (±days)",
        moveToSpecificDate: "Move to specific date",
        swapModeActive: "SWAP MODE: Selected",
        swapModeSelectTarget: "Right-click on the day you want to swap with",
        swapped: "Swapped between",
        offsetPrompt: "Offset project",
        offsetPromptDetails: "Enter number of days (positive = forward, negative = backward):",
        invalidDays: "Invalid number of days!",
        projectOffset: "Project",
        offsetForward: "offset forward",
        offsetBackward: "offset backward",
        days: "days",
        moveToDatePrompt: "Move project",
        moveToDateDetails: "to specific date\nEnter date (YYYY-MM-DD):",
        invalidDateFormat: "Invalid date format! Use YYYY-MM-DD (e.g., 2025-03-15)",
        invalidDate: "Invalid date!",
        projectMovedTo: "Project",
        movedTo: "moved to",
        copiedTo: "Copied",
        to: "to",
        blocksMoved: "Blocks moved!",
        blocksDeleted: "Blocks deleted!",
        confirmDeleteBlocks: "Do you want to delete",
        markedBlocks: "selected blocks?",
        nothingToUndo: "Nothing to undo!",
        undone: "Undone!",
        nothingToRedo: "Nothing to redo!",
        redone: "Redone!",
        
        // Reports
        capacityReport: "CAPACITY REPORT",
        capacityPerWeek: "CAPACITY PER WEEK",
        dailyCapacity: "DAILY CAPACITY",
        leadTimePerProject: "LEAD TIME PER PROJECT",
        interruptionReport: "INTERRUPTION REPORT",
        period: "Period",
        workDays: "Work days",
        availableHours: "Available time (h)",
        allocatedHours: "Allocated time (h)",
        capacityPercent: "Capacity (%)",
        overloadHours: "Overload (h)",
        plannedHours: "Planned time (h)",
        actualHours: "Actual time (h)",
        variance: "Variance (h)",
        week: "Week",
        date: "Date",
        weekday: "Weekday",
        meetings: "Meetings (h)",
        interruptions: "Interruptions (h)",
        projects: "Projects (h)",
        available: "Available (h)",
        allocated: "Allocated (h)",
        overload: "Overload (h)",
        projectName: "Project name",
        startDate: "Start date",
        endDate: "End date",
        type: "Type",
        leadTimeDays: "Lead time (days)",
        totalPlanned: "Total planned",
        totalActual: "Total actual",
        totalVariance: "Total variance",
        totalInterruptionTime: "Total interruption time",
        totalWasteTime: "Total waste (rework, late addition)",
        closeReport: "Close report",
        exportToCsv: "Export to CSV",
        capacityReportTitle: "Capacity report per week",
        capacityByWeek: "Capacity by week",
        graphicalCapacity: "Graphical Capacity",
        allocatedTime: "Scheduled time (h)",
        projectShare: "Project share",
        wasteShare: "Waste share",
        closeAndGoBack: "Close & Go back",
        exportToExcel: "Export to Excel (CSV)",
        reworkLabel: "Rework",
        lateAdditionLabel: "Late addition",
        interruptionLabel: "Interruption",
        to: "to",
        ok: "OK",
        nearMax: "Near max",
        overloaded: "Overloaded",
        dailyCapacityTitle: "Daily capacity",
        status: "Status",
        waste: "Waste (h)",
        projectShareExplanation: "share of scheduled time that is project time",
        wasteShareExplanation: "rework + late addition + interruptions in relation to scheduled time",
        leadTimeVsIdeal: "Lead time per project — actual vs ideal",
        leadTimeDescription: "Comparison of actual lead time (work days) against ideal with 6 hours project time per day, and target 75% of work time as project time",
        hoursPerDay: "h/day",
        totalHours: "Total hours",
        actualLeadTimeDays: "Actual lead time (days)",
        ideal6hPerDay: "Ideal 6h/day (days)",
        varianceVs6h: "Variance vs 6h",
        ideal75Percent: "Ideal 75% (days)",
        varianceVs75: "Variance vs 75%",
        noProjectsFound: "No projects found for the year",
        summary: "Summary",
        measurement: "Measurement",
        value: "Value",
        totalInterruptionsPerYear: "Total interruptions per year",
        avgInterruptionsPerDay: "Average interruptions per day",
        interruptionsByDepartment: "Interruptions by Department",
        department: "Department",
        count: "Count",
        share: "Share (%)",
        graph: "Graph",
        interruptionsByContactMethod: "Interruptions by Contact Method",
        method: "Method",
        interruptionsPerDay: "Interruptions per Day",
        day: "Day",
        numInterruptions: "Number of Interruptions",
        details: "Details",
        
        // Interruption report
        allInterruptions: "All interruptions",
        totalHours: "Total (h)",
        
        // Quality losses
        qualityLossReport: "Quality Losses per Project",
        qualityLossReportSubtitle: "Shows all registered time for quality losses linked to projects.",
        noQualityLossesRegistered: "No quality losses registered.",
        totalTime: "Total time",
        events: "events",
        event: "event",
        perDepartment: "Per Department",
        perLossType: "Per Loss Type",
        showAllEvents: "Show all",
        hours: "Hours",
        percent: "Percent",
        lossType: "Loss Type",
        detailedList: "Detailed list",
        reportCreated: "Report created",
        noProjectSpecified: "No project specified",
        unknown: "Unknown",
        distributionPerDepartment: "Distribution per Department",
        distributionPerLossType: "Distribution per Loss Type",
        qualityLossesPerProject: "Quality Losses per Project",
        enterReportName: "Enter report name (optional):",
        
        // Capacity report - new
        yearSummary: "Annual Summary",
        availableTime: "Available time",
        usedTime: "Used time",
        totalOvertime: "Total overtime",
        interruptionsPiMail: "Interruptions (PI/Mail)",
        qualityLoss: "Quality loss",
        addQualityLoss: "Add waste",
        capacityStatusLegend: "📊 <strong>Green</strong> = Good capacity (under 85%) | <strong style='color:#f39c12'>Yellow</strong> = High load (85-100%) | <strong style='color:#e74c3c'>Red</strong> = Overloaded (over 100%)",
        otherTasks: "Other tasks",
        overtime: "Overtime",
        statusOverloaded: "🔴 Overloaded",
        statusHighLoad: "🟡 High Load",
        statusGoodCapacity: "🟢 Good Capacity",
        dailyCapacityWorkdays: "Daily capacity (workdays)",
        dailyCapacityDescription: "Shows workdays only. <strong>Overtime</strong> = time beyond normal 8-hour workday.",
        supportChange: "Support/Change",
        other: "Other",
        statusOk: "🟢 OK",
        statusHigh: "🟡 High",
        explanationOfTerms: "💡 Explanation of Terms",
        availableTimeExplanation: "Total work time per day/week (including any overtime).",
        
        // Menu
        menuTitle: "Menu",
        capacityReportMenuItem: "📊 Capacity Report",
        interruptionReportMenuItem: "📞 Interruption Report",
        qualityLossReportMenuItem: "⚠️ Quality Loss Report",
        colorScheme: "🎨 Color Scheme",
        purpleBlue: "Purple-Blue",
        grayBlue: "Gray-Blue",
        greenTeal: "Green-Teal",
        orangeRed: "Orange-Red",
        dark: "Dark",
        settings: "⚙️ Settings",
        licenseMenuItem: "🔑 License",
        saveToFileMenu: "💾 Save to file",
        loadFileMenu: "📂 Load file",
        userManual: "📘 User Manual",
        deleteAllMenu: "🗑 Delete all",
        usedTimeExplanation: "Sum of all allocated time for tasks.",
        utilizationExplanation: "Used time ÷ Available time × 100%. Shows how full the schedule is.",
        overtimeExplanation: "Time beyond normal 8-hour workday.",
        qualityLossExplanation: "Work that doesn't create value = Rework + Late addition. <em>Excludes interruptions as these are often legitimate work tasks (PI, mail).</em>",
        projectCompletion: "Project Completion",
        projectCompletionDescription: "Compares actual completion time with ideal scenario (75% of work time = {hours}h/day).",
        total: "Total",
        actualWorkDays: "Actual workdays",
        idealWorkDays75: "Ideal workdays (75%)",
        completionEfficiency: "Completion efficiency",
        interpretation: "Interpretation:",
        greenDeviationExplanation: "• <strong style='color:#27ae60'>Green deviation (negative)</strong> = Project completed faster than ideal (good!)",
        redDeviationExplanation: "• <strong style='color:#e74c3c'>Red deviation (positive)</strong> = Project took longer than ideal (delay)",
        efficiencyExplanation: "• <strong>Completion efficiency</strong> = How close to ideal the project came. 100% = perfect pace, under 70% = significant delay.",
        noProjects: "No projects found.",
        
        // CSV export - capacity report
        csvYearSummary: "ANNUAL SUMMARY",
        availableTimeHours: "Available time (h)",
        usedTimeHours: "Used time (h)",
        utilizationPercent: "Utilization (%)",
        totalOvertimeHours: "Total overtime (h)",
        timeDistribution: "TIME DISTRIBUTION",
        projectsHours: "Projects (h)",
        supportHours: "Support (h)",
        changeHours: "Change (h)",
        improvementHours: "Improvement (h)",
        eplanHours: "Eplan (h)",
        interruptionsPiMailHours: "Interruptions PI/Mail (h)",
        qualityLossOtherDeptHours: "Quality loss from other dept. (h)",
        csvQualityLoss: "QUALITY LOSS",
        reworkHours: "Rework (h)",
        lateAdditionHours: "Late addition (h)",
        totalQualityLossHours: "Total quality loss (h)",
        shareOfTotalTimePercent: "Share of total time (%)",
        csvCapacityPerWeek: "CAPACITY PER WEEK",
        csvDailyCapacity: "DAILY CAPACITY",
        csvProjectCompletion: "PROJECT COMPLETION",
        highLoad: "High load",
        capacityReportExportedToCsv: "Capacity report (weekly) exported to CSV.",
        goodCapacity: "Good capacity",
        
        // Interruption report - new
        totalInterruptionCount: "Total interruption count",
        totalTimeLost: "Total time lost",
        totalTimeLostHours: "Total time lost (h)",
        totalTimeLostMinutes: "Total time lost (min)",
        interruptionsPerDayAvg: "Interruptions per day (avg)",
        timePerDayAvg: "Time per day (avg)",
        timePerDayAvgMin: "Time per day (avg, min)",
        timePerInterruptionAvgMin: "Time per interruption (avg, min)",
        avgTimePerInterruption: "Average time per interruption",
        improvementPotential: "💡 Improvement Potential",
        improvementPotential25: "Improvement potential (25% reduction, h)",
        if25PercentReduction: "If interruptions decreased by 25%:",
        savedTime: "saved time",
        csvInterruptionsPerDepartment: "INTERRUPTIONS PER DEPARTMENT",
        csvInterruptionsPerContactMethod: "INTERRUPTIONS PER CONTACT METHOD",
        contactMethod: "Contact method",
        csvInterruptionsPerMonth: "INTERRUPTIONS PER MONTH",
        month: "Month",
        csvDetailedInterruptionList: "DETAILED INTERRUPTION LIST",
        contact: "Contact",
        issue: "Issue",
        interruptionReportExportedToCsv: "Interruption report exported to CSV.",
        interruptionsByDepartmentTitle: "📊 Interruptions by department",
        departmentSectionDescription: "Shows which departments cause the most interruptions and how much time they take.",
        interruptionCount: "Interruption count",
        shareOfTotal: "Share of total",
        totalTimeMin: "Total time (min)",
        totalTimeHours: "Total time (h)",
        avgPerInterruptionMin: "Avg per interruption (min)",
        distribution: "Distribution",
        interruptionsByContactMethodTitle: "📱 Interruptions by contact method",
        contactMethodSectionDescription: "Shows how interruptions come in (phone, mail, in person, etc.).",
        interruptionsByMonthTitle: "📅 Interruptions by month",
        avgInterruptionsPerDay2: "Avg interruptions/day",
        trend: "Trend",
        top10DaysMostInterruptions: "🔝 Top 10 days with most interruptions",
        insightsAndImprovements: "💡 Insights and Improvement Suggestions",
        improvementPotentialLabel: "Improvement potential:",
        improvementPotentialText: "If interruptions are reduced by 25%, approximately {hours} hours per year are saved.",
        focusAreas: "Focus areas:",
        topDepartmentsText: "The three departments causing the most interruptions account for {percent}% of all interruptions.",
        contactMethodLabel: "Contact method:",
        isMostCommonMethod: "is the most common contact method",
        noData: "No data.",
        explanationOfMetrics: "📊 Explanation of Metrics",
        interruptionCountExplanation: "Total number of registered interruptions during the year.",
        totalTimeLostExplanation: "Sum of all time spent on interruptions (in hours and minutes).",
        avgPerInterruptionExplanation: "Average time each interruption takes (total time ÷ number of interruptions).",
        interruptionsPerDayExplanation: "Average number of interruptions per workday.",
        improvementPotentialExplanation: "Calculated time that can be saved by reducing interruptions.",
        
        // Language switcher
        language: "Language",
        
        // New features - Multi-select, Swap, Offset, etc.
        blocksSelected: "blocks selected",
        deleteSelectedBlocks: "Delete selected blocks",
        deselectAll: "Deselect all",
        swapWithDay: "Swap with another day",
        completeSwap: "Swap with this day",
        cancelSwap: "Cancel swap",
        offsetProject: "Offset project (±days)",
        moveToSpecificDate: "Move to specific date",
        swapModeActive: "SWAP MODE: Selected",
        swapModeSelectTarget: "Right-click on the day you want to swap with",
        swapped: "Swapped between",
        offsetPrompt: "Offset project",
        offsetPromptDetails: "Enter number of days (positive = forward, negative = backward):",
        invalidDays: "Invalid number of days!",
        projectOffset: "Project",
        offsetForward: "offset forward",
        offsetBackward: "offset backward",
        days: "days",
        moveToDatePrompt: "Move project",
        moveToDateDetails: "to specific date\nEnter date (YYYY-MM-DD):",
        invalidDateFormat: "Invalid date format! Use YYYY-MM-DD (e.g. 2025-03-15)",
        invalidDate: "Invalid date!",
        projectMovedTo: "Project",
        movedTo: "moved to",
        copiedTo: "Copied",
        to: "to",
        blocksMoved: "Blocks moved!",
        blocksDeleted: "Blocks deleted!",
        confirmDeleteBlocks: "Do you want to delete",
        markedBlocks: "marked blocks?",
        nothingToUndo: "Nothing to undo!",
        undone: "Undone!",
        nothingToRedo: "Nothing to redo!",
        redone: "Redone!",
        
        // Create gap
        createGap: "Create gap from this day",
        createGapPrompt: "Create gap in project",
        createGapDetails: "Enter number of days for the gap (positive days):",
        invalidGapDays: "Enter a positive number of days!",
        noAllocationsFound: "No allocations found from",
        andForward: "and forward for project",
        gapCreated: "Gap of",
        gapCreatedIn: "days created in project",
        from: "from"
    }
};

// Funktion för att hämta översättning
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Funktion för att byta språk
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);

    // Regenerera tidslinje för att uppdatera veckodagar
    generateTimeline();

    // Uppdatera avbrottsloggen
    if (typeof initInterruptionTimeline === 'function') {
        initInterruptionTimeline();
    }

    // Uppdatera kvalitetsförlustloggen
    if (typeof initQualityLossTimeline === 'function') {
        initQualityLossTimeline();
    }

    // Uppdatera alla UI-element efter render, så knapptexter inte fastnar i fel språk
    updateUILanguage();

    // Säkerställ uppdatering även om något renderas asynkront i efterhand
    setTimeout(updateUILanguage, 0);
}

// Funktion för att uppdatera alla UI-element med rätt språk
function updateUILanguage() {
    // Huvudrubrik och underrubrik
    document.getElementById('mainTitle').textContent = t('pageTitle');
    document.getElementById('subtitle').textContent = t('subtitle');
    
    // Kontrollpanel labels
    const yearLabel = document.querySelector('label[for="yearInput"]');
    if (yearLabel) yearLabel.textContent = t('showPlanningForYear');
    
    const updateBtn = document.querySelector('button[onclick="setTimelineYear()"]');
    if (updateBtn) updateBtn.textContent = t('updateTimeline');
    
    const downloadBtn = document.querySelector('button[onclick="downloadData()"]');
    if (downloadBtn) downloadBtn.textContent = t('saveToFile');
    
    const uploadLabel = document.querySelector('label[for="uploadFile"]');
    if (uploadLabel) uploadLabel.textContent = t('loadFile');
    
    const clearBtn = document.querySelector('button[onclick="clearAllTasks()"]');
    if (clearBtn) clearBtn.textContent = t('deleteAll');
    
    const reportTitle = document.getElementById('reportTitle');
    if (reportTitle) reportTitle.placeholder = t('reportName');
    
    const capacityBtn = document.querySelector('button[onclick="generateWeeklyReport()"]');
    if (capacityBtn) capacityBtn.textContent = t('generateCapacityReport');
    
    const interruptionBtn = document.querySelector('button[onclick="generateInterruptionReport()"]');
    if (interruptionBtn) interruptionBtn.textContent = t('generateInterruptionReport');
    
    const taskNameInput = document.getElementById('taskName');
    if (taskNameInput) taskNameInput.placeholder = t('taskName');
    
    const taskHoursInput = document.getElementById('taskHours');
    if (taskHoursInput) taskHoursInput.placeholder = t('hours');
    
    const placeTaskBtn = document.querySelector('button[onclick="startAddTask()"]');
    if (placeTaskBtn) placeTaskBtn.textContent = t('placeTask');
    
    // Uppgiftstyper i dropdown
    const taskTypeSelect = document.getElementById('taskType');
    if (taskTypeSelect && taskTypeSelect.options.length >= 7) {
        taskTypeSelect.options[0].text = t('project');
        taskTypeSelect.options[1].text = t('support');
        taskTypeSelect.options[2].text = t('change');
        taskTypeSelect.options[3].text = t('improvement');
        taskTypeSelect.options[4].text = t('rework');
        taskTypeSelect.options[5].text = t('lateAddition');
        taskTypeSelect.options[6].text = t('eplanMaintenance');
    }
    
    // Modal för projektplacering
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = t('projectScheduling');
    
    const modalText = document.querySelector('#directionModal p');
    if (modalText && modalText.childNodes[0]) {
        modalText.childNodes[0].textContent = t('howToAllocate') + ' (';
    }
    
    const forwardBtn = document.querySelector('.forward');
    if (forwardBtn) forwardBtn.textContent = t('forward');
    
    const backwardBtn = document.querySelector('.backward');
    if (backwardBtn) backwardBtn.textContent = t('backward');
    
    document.querySelectorAll('.cancel').forEach(btn => btn.textContent = t('cancel'));
    
    // Avbrottslogg rubrik
    const interruptionHeader = document.querySelector('#interruption-container h2');
    if (interruptionHeader) {
        interruptionHeader.textContent = t('interruptionLog');
    }
    
    // Menyöversättningar
    const menuTitle = document.querySelector('#dropdownMenu h3');
    if (menuTitle) menuTitle.textContent = t('menuTitle');
    
    const capacityReportBtn = document.querySelector('button[onclick*="generateWeeklyReport"]');
    if (capacityReportBtn) capacityReportBtn.innerHTML = t('capacityReportMenuItem');
    
    const interruptionReportBtn = document.querySelector('button[onclick*="generateInterruptionReport"]');
    if (interruptionReportBtn) interruptionReportBtn.innerHTML = t('interruptionReportMenuItem');
    
    const qualityLossReportBtn = document.querySelector('button[onclick*="generateQualityLossReport"]');
    if (qualityLossReportBtn) qualityLossReportBtn.innerHTML = t('qualityLossReportMenuItem');
    
    const colorSchemeLabel = document.querySelector('.submenu-toggle .submenu-title');
    if (colorSchemeLabel) {
        colorSchemeLabel.textContent = t('colorScheme');
    }
    
    const themeOptions = document.querySelectorAll('.theme-option .theme-label');
    if (themeOptions.length >= 5) {
        themeOptions[0].textContent = t('purpleBlue');
        themeOptions[1].textContent = t('grayBlue');
        themeOptions[2].textContent = t('greenTeal');
        themeOptions[3].textContent = t('orangeRed');
        themeOptions[4].textContent = t('dark');
    }
    
    const settingsBtn = document.querySelector('button[onclick*="openSettingsModal"]');
    if (settingsBtn) settingsBtn.innerHTML = t('settings');
    
    const licenseBtn = document.querySelector('button[onclick*="openLicenseModal"]');
    if (licenseBtn) licenseBtn.innerHTML = t('licenseMenuItem');
    
    const saveFileBtn = document.querySelector('button[onclick*="downloadData"]');
    if (saveFileBtn && saveFileBtn.parentElement.id === 'dropdownMenu') {
        saveFileBtn.innerHTML = t('saveToFileMenu');
    }
    
    const loadFileBtn = document.querySelector('button[onclick*="uploadFile.click"]');
    if (loadFileBtn) loadFileBtn.innerHTML = t('loadFileMenu');
    
    const manualBtn = document.querySelector('button[onclick*="ANVÄNDARMANUAL.html"]');
    if (manualBtn) manualBtn.innerHTML = t('userManual');
    
    const deleteAllBtn = document.querySelector('button[onclick*="clearAllTasks"].danger');
    if (deleteAllBtn) deleteAllBtn.innerHTML = t('deleteAllMenu');

    document.querySelectorAll('.add-interruption-btn').forEach(btn => {
        btn.textContent = t('addInterruption');
    });

    document.querySelectorAll('.add-quality-loss-btn').forEach(btn => {
        btn.textContent = t('addQualityLoss');
    });

    document.querySelectorAll('#quality-loss-timeline .quality-loss-day > button').forEach(btn => {
        btn.textContent = t('addQualityLoss');
    });
}
