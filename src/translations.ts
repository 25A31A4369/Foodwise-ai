import { Language } from './types';

export interface AppTranslations {
  brand: {
    name: string;
    tagline: string;
    offlineBadge: string;
    mission: string;
  };
  nav: {
    today: string;
    forecast: string;
    production: string;
    inventory: string;
    wasteRisk: string;
    rescuePlan: string;
    feedback: string;
    experiments: string;
    menu: string;
    replay: string;
    reports: string;
    settings: string;
  };
  header: {
    goodMorning: string;
    subheading: string;
    addUpdateBtn: string;
    somethingChangedBtn: string;
    demoTourBtn: string;
    resetDemoBtn: string;
  };
  cards: {
    expectedCustomers: string;
    foodAtRisk: string;
    potentialWasteAvoided: string;
    potentialCostSaving: string;
  };
  todaySection: {
    title: string;
    subtitle: string;
    btnAccept: string;
    btnChange: string;
    btnReject: string;
    btnAddKnowledge: string;
    btnWhy: string;
    confidence: string;
    expectedImpact: string;
    risksIfIgnored: string;
    alternatives: string;
    wasteAvoidedPrefix: string;
  };
  rescueSection: {
    title: string;
    subtitle: string;
    tierOrderNotice: string;
    btnExecute: string;
    btnDetails: string;
    tierUse: string;
    tierAllocate: string;
    tierPromote: string;
    tierRedesign: string;
    tierRedistribute: string;
    tierDiscard: string;
  };
  forecastSection: {
    title: string;
    subtitle: string;
    whyDifferentBtn: string;
    whyDifferentTitle: string;
    daysLabel: string;
    customersLabel: string;
  };
  productionSection: {
    title: string;
    subtitle: string;
    demandLabel: string;
    stockLabel: string;
    recommendedLabel: string;
    changePrompt: string;
  };
  inventorySection: {
    title: string;
    subtitle: string;
    fefoBadge: string;
    batchLabel: string;
    daysRemainingLabel: string;
    dailyUsageLabel: string;
    surplusLabel: string;
    riskLabel: string;
  };
  experimentsSection: {
    title: string;
    subtitle: string;
    hypothesisTitle: string;
    metricsTitle: string;
    btnApprove: string;
    btnDismiss: string;
    learningTitle: string;
  };
  menuSection: {
    title: string;
    subtitle: string;
    atRiskBadge: string;
    wasteCutBadge: string;
    btnApprove: string;
    btnReject: string;
  };
  replaySection: {
    title: string;
    subtitle: string;
    aiPredictedCol: string;
    humanDecidedCol: string;
    actualOutcomeCol: string;
    reasonCol: string;
    learningNoteCol: string;
  };
  reportsSection: {
    title: string;
    subtitle: string;
    foodPurchased: string;
    foodPrepared: string;
    foodSold: string;
    foodLeftover: string;
    foodWasted: string;
    wasteAvoided: string;
    moneySaved: string;
    accuracy: string;
    chartTitle: string;
  };
  settingsSection: {
    title: string;
    subtitle: string;
    locationLabel: string;
    peopleServedLabel: string;
    resetTitle: string;
    resetDesc: string;
    resetConfirm: string;
    cancel: string;
  };
  firstSetup: {
    title: string;
    subtitle: string;
    qPeople: string;
    qMeals: string;
    qLocation: string;
    qLocalInfo: string;
    btnFinish: string;
  };
}

export const translations: Record<Language, AppTranslations> = {
  en: {
    brand: {
      name: 'FOODWISE AI',
      tagline: 'Predict. Prevent. Rescue.',
      offlineBadge: 'OFFLINE DEMO',
      mission: 'Turn yesterday’s leftovers into tomorrow’s smarter decisions.',
    },
    nav: {
      today: 'Today',
      forecast: 'Forecast',
      production: 'Production',
      inventory: 'Inventory',
      wasteRisk: 'Waste Risk',
      rescuePlan: 'Rescue Plan',
      feedback: 'Leftover Feedback',
      experiments: 'Experiments',
      menu: 'Smart Menu',
      replay: 'Decision Replay',
      reports: 'Reports',
      settings: 'Settings',
    },
    header: {
      goodMorning: 'GOOD MORNING',
      subheading: 'Here is what you need to know today to reduce food waste.',
      addUpdateBtn: '＋ ADD / UPDATE',
      somethingChangedBtn: '＋ SOMETHING CHANGED?',
      demoTourBtn: '🎯 3-Min Demo Story',
      resetDemoBtn: 'Reset Demo',
    },
    cards: {
      expectedCustomers: 'CUSTOMERS EXPECTED',
      foodAtRisk: 'FOOD AT RISK',
      potentialWasteAvoided: 'POTENTIAL WASTE AVOIDED',
      potentialCostSaving: 'POTENTIAL COST SAVING',
    },
    todaySection: {
      title: 'WHAT SHOULD I DO TODAY?',
      subtitle: 'Clear operational actions to meet customer demand with minimal avoidable waste.',
      btnAccept: 'ACCEPT',
      btnChange: 'CHANGE',
      btnReject: 'REJECT',
      btnAddKnowledge: 'ADD MY KNOWLEDGE',
      btnWhy: 'Why?',
      confidence: 'Confidence',
      expectedImpact: 'Expected Impact',
      risksIfIgnored: 'Risks If Ignored',
      alternatives: 'Alternatives',
      wasteAvoidedPrefix: 'Potential waste avoided',
    },
    rescueSection: {
      title: 'WASTE RESCUE MODE',
      subtitle: 'Never classify food as waste prematurely. Evaluate actions in strict order: USE → ALLOCATE → PROMOTE → REDESIGN → REDISTRIBUTE → DISCARD.',
      tierOrderNotice: 'Tiered Rescue Hierarchy: Safe culinary use first; discard only as unavoidable last resort.',
      btnExecute: 'Execute Rescue Plan',
      btnDetails: 'View Alternatives',
      tierUse: '1. USE',
      tierAllocate: '2. ALLOCATE',
      tierPromote: '3. PROMOTE',
      tierRedesign: '4. REDESIGN',
      tierRedistribute: '5. REDISTRIBUTE',
      tierDiscard: '6. DISCARD',
    },
    forecastSection: {
      title: 'DEMAND FORECAST',
      subtitle: 'Simple, transparent visual demand projection connecting footfall directly to meal quantities.',
      whyDifferentBtn: 'Why is today’s forecast different?',
      whyDifferentTitle: 'Factors Analyzed Today',
      daysLabel: 'Days',
      customersLabel: 'Expected Customers',
    },
    productionSection: {
      title: 'HOW MUCH SHOULD WE PREPARE?',
      subtitle: 'Formula: Customer Demand — Usable On-Hand Stock = Recommended Kitchen Batch.',
      demandLabel: 'Customer Demand',
      stockLabel: 'Current Usable Stock',
      recommendedLabel: 'Recommended Production',
      changePrompt: 'Enter your preferred kitchen quantity (kg):',
    },
    inventorySection: {
      title: 'INGREDIENT LIFECYCLE & FEFO',
      subtitle: 'First Expire → First Use. Track batches from purchase to preparation and rescue.',
      fefoBadge: 'FEFO Protocol Active',
      batchLabel: 'Batch #',
      daysRemainingLabel: 'Days Left',
      dailyUsageLabel: 'Expected Usage',
      surplusLabel: 'Expected Surplus',
      riskLabel: 'Waste Risk',
    },
    experimentsSection: {
      title: 'AI EXPERIMENT LAB',
      subtitle: 'Safe, controlled kitchen experiments to test uncertain assumptions and permanently eliminate waste.',
      hypothesisTitle: 'Hypothesis & Method',
      metricsTitle: 'Metrics to Track',
      btnApprove: 'Approve Controlled Test',
      btnDismiss: 'Dismiss',
      learningTitle: 'WHAT DID WE LEARN?',
    },
    menuSection: {
      title: 'SMART MENU REDESIGN',
      subtitle: 'Automatic culinary ideas utilizing at-risk surplus ingredients. Requires chef approval.',
      atRiskBadge: 'Absorbs At-Risk Stock',
      wasteCutBadge: 'Waste Cut',
      btnApprove: 'Approve for Today’s Menu',
      btnReject: 'Not Today',
    },
    replaySection: {
      title: 'DECISION REPLAY (AI VS HUMAN VS ACTUAL)',
      subtitle: 'See what AI predicted, what the manager decided, and what actually happened. Builds transparency and trust.',
      aiPredictedCol: 'AI Predicted',
      humanDecidedCol: 'Manager Decided',
      actualOutcomeCol: 'Actual Outcome',
      reasonCol: 'Reason / Context',
      learningNoteCol: 'System Learning',
    },
    reportsSection: {
      title: 'WASTE & OPERATIONAL REPORTS',
      subtitle: 'Plain-language numbers starting from zero. No vanity metrics or hidden calculations.',
      foodPurchased: 'Food Purchased',
      foodPrepared: 'Food Prepared',
      foodSold: 'Food Sold',
      foodLeftover: 'Leftovers',
      foodWasted: 'Food Discarded',
      wasteAvoided: 'Waste Avoided',
      moneySaved: 'Money Saved',
      accuracy: 'Forecast Accuracy',
      chartTitle: '7-Day Trend: Food Waste Avoided vs Actual Leftovers',
    },
    settingsSection: {
      title: 'APPLICATION SETTINGS & DEMO CONTROLS',
      subtitle: 'Configure your kitchen baseline or reset demo data to pristine state.',
      locationLabel: 'Kitchen / Campus Location',
      peopleServedLabel: 'Average Daily People Served',
      resetTitle: 'Reset Demo State?',
      resetDesc: 'This will reset all your inputs, predictions, inventory, experiments, and learned history back to default state.',
      resetConfirm: 'Yes, Reset Demo',
      cancel: 'Cancel',
    },
    firstSetup: {
      title: 'WELCOME TO FOODWISE AI',
      subtitle: 'Tell us a few basic details so we can calibrate your daily kitchen portions.',
      qPeople: 'How many people do you usually serve daily?',
      qMeals: 'Which meals do you serve?',
      qLocation: 'What is your location?',
      qLocalInfo: 'Any important local information today?',
      btnFinish: 'ENTER FOODWISE',
    },
  },
  hi: {
    brand: {
      name: 'FOODWISE AI',
      tagline: 'पूर्वानुमान. रोकथाम. बचाव.',
      offlineBadge: 'ऑफ़लाइन डेमो',
      mission: 'कल के बचे खाने को कल के समझदार फैसलों में बदलें।',
    },
    nav: {
      today: 'आज का दिन',
      forecast: 'मांग पूर्वानुमान',
      production: 'तैयारी (उत्पादन)',
      inventory: 'राशन स्टॉक',
      wasteRisk: 'बर्बादी जोखिम',
      rescuePlan: 'बचाव योजना',
      feedback: 'बचा हुआ खाना (फीडबैक)',
      experiments: 'प्रयोगशाला',
      menu: 'स्मार्ट मेनू',
      replay: 'निर्णय समीक्षा',
      reports: 'रिपोर्ट',
      settings: 'सेटिंग्स',
    },
    header: {
      goodMorning: 'सुप्रभात',
      subheading: 'भोजन की बर्बादी रोकने के लिए आज आपको यह जानना ज़रूरी है।',
      addUpdateBtn: '＋ जानकारी जोड़ें',
      somethingChangedBtn: '＋ कुछ बदलाव हुआ?',
      demoTourBtn: '🎯 3-मिनट डेमो गाइड',
      resetDemoBtn: 'रीसेट डेमो',
    },
    cards: {
      expectedCustomers: 'संभावित ग्राहक',
      foodAtRisk: 'जोखिम में भोजन',
      potentialWasteAvoided: 'बचाया जा सकने वाला खाना',
      potentialCostSaving: 'अनुमानित बचत',
    },
    todaySection: {
      title: 'आज मुझे क्या करना चाहिए?',
      subtitle: 'ग्राहकों की मांग पूरी करने और बर्बादी रोकने के स्पष्ट कदम।',
      btnAccept: 'स्वीकार करें',
      btnChange: 'बदलें',
      btnReject: 'अस्वीकार करें',
      btnAddKnowledge: 'मेरी जानकारी जोड़ें',
      btnWhy: 'क्यों?',
      confidence: 'सटीकता विश्वास',
      expectedImpact: 'अपेक्षित प्रभाव',
      risksIfIgnored: 'न मानने पर जोखिम',
      alternatives: 'अन्य विकल्प',
      wasteAvoidedPrefix: 'बचाई गई संभावित बर्बादी',
    },
    rescueSection: {
      title: 'भोजन बचाव मोड (RESCUE PLAN)',
      subtitle: 'किसी भी खाद्य सामग्री को सीधे कचरा न मानें। 6 चरणों में मूल्यांकन करें: उपयोग → स्थानांतरण → विशेष ऑफर → मेनू बदलाव → दान → निपटान।',
      tierOrderNotice: 'बचाव क्रम: पहले रसोई में उपयोग, कचरा केवल अंतिम लाचारी में।',
      btnExecute: 'बचाव योजना लागू करें',
      btnDetails: 'अन्य विकल्प देखें',
      tierUse: '1. उपयोग करें',
      tierAllocate: '2. भेजें (ट्रांसफर)',
      tierPromote: '3. विशेष ऑफर दें',
      tierRedesign: '4. नया व्यंजन बनाएं',
      tierRedistribute: '5. दान/बांटें',
      tierDiscard: '6. फेंकें',
    },
    forecastSection: {
      title: 'मांग का पूर्वानुमान',
      subtitle: 'ग्राहकों की संख्या और आवश्यक थाली का सीधा और सरल अनुमान।',
      whyDifferentBtn: 'आज का अनुमान अलग क्यों है?',
      whyDifferentTitle: 'आज के प्रमुख कारण',
      daysLabel: 'दिन',
      customersLabel: 'संभावित ग्राहक',
    },
    productionSection: {
      title: 'आज कितना खाना बनाना चाहिए?',
      subtitle: 'सूत्र: ग्राहकों की मांग — उपलब्ध तैयार खाना = सुझाई गई नई तैयारी।',
      demandLabel: 'कुल मांग',
      stockLabel: 'मौजूदा उपलब्ध मात्रा',
      recommendedLabel: 'सुझाई गई नई तैयारी',
      changePrompt: 'आप जितनी मात्रा (किलो) बनाना चाहते हैं, दर्ज करें:',
    },
    inventorySection: {
      title: 'सामग्री का चक्र और FEFO',
      subtitle: 'पहले समाप्त होने वाला सामान पहले इस्तेमाल करें (First Expire → First Use)।',
      fefoBadge: 'FEFO नियम सक्रिय',
      batchLabel: 'बैच नंबर',
      daysRemainingLabel: 'बचे हुए दिन',
      dailyUsageLabel: 'दैनिक खपत',
      surplusLabel: 'बच जाने का अनुमान',
      riskLabel: 'जोखिम स्तर',
    },
    experimentsSection: {
      title: 'AI रसोई प्रयोगशाला',
      subtitle: 'बिना नुकसान के छोटे परीक्षण करके बर्बादी को हमेशा के लिए कम करें।',
      hypothesisTitle: 'परीक्षण का आधार',
      metricsTitle: 'नापने योग्य बातें',
      btnApprove: 'परीक्षण शुरू करें',
      btnDismiss: 'रहने दें',
      learningTitle: 'हमने क्या सीखा?',
    },
    menuSection: {
      title: 'स्मार्ट मेनू सुझाव',
      subtitle: 'खराब होने से पहले सामान को स्वादिष्ट विशेष व्यंजन में बदलें।',
      atRiskBadge: 'जोखिम वाले राशन की खपत',
      wasteCutBadge: 'बर्बादी में कमी',
      btnApprove: 'आज के मेनू में जोड़ें',
      btnReject: 'अभी नहीं',
    },
    replaySection: {
      title: 'निर्णय समीक्षा (AI बनाम इंसान बनाम सच)',
      subtitle: 'देखें कि AI ने क्या कहा, आपने क्या तय किया और वास्तव में क्या हुआ।',
      aiPredictedCol: 'AI अनुमान',
      humanDecidedCol: 'आपका निर्णय',
      actualOutcomeCol: 'वास्तविक परिणाम',
      reasonCol: 'कारण',
      learningNoteCol: 'AI सीख',
    },
    reportsSection: {
      title: 'बर्बादी और बचत रिपोर्ट',
      subtitle: 'शून्य से शुरू होने वाले सरल आंकड़े।',
      foodPurchased: 'खरीदा गया राशन',
      foodPrepared: 'पकाया गया खाना',
      foodSold: 'बिका हुआ खाना',
      foodLeftover: 'बचा हुआ खाना',
      foodWasted: 'फेंका गया खाना',
      wasteAvoided: 'बचाया गया खाना',
      moneySaved: 'पैसे की बचत',
      accuracy: 'अनुमान सटीकता',
      chartTitle: '7 दिनों का ट्रेंड: बर्बादी में कमी बनाम बचा हुआ खाना',
    },
    settingsSection: {
      title: 'सेटिंग्स और डेमो नियंत्रण',
      subtitle: 'रसोई का पता बदलें या डेमो डेटा रीसेट करें।',
      locationLabel: 'रसोई / संस्थान का स्थान',
      peopleServedLabel: 'प्रतिदिन औसत लोग',
      resetTitle: 'क्या डेमो रीसेट करना है?',
      resetDesc: 'यह आपके सभी इनपुट, प्रयोगों और इतिहास को फिर से शुरुआती स्थिति में ला देगा।',
      resetConfirm: 'हां, सब रीसेट करें',
      cancel: 'रद्द करें',
    },
    firstSetup: {
      title: 'FoodWise AI में आपका स्वागत है',
      subtitle: 'कृपया अपनी रसोई के बारे में कुछ सरल जानकारी दें।',
      qPeople: 'आप प्रतिदिन कितने लोगों को खाना परोसते हैं?',
      qMeals: 'आप कौन-से समय का खाना बनाते हैं?',
      qLocation: 'आपका स्थान क्या है?',
      qLocalInfo: 'आज कोई विशेष स्थानीय बात (बारिश, मेला, आयोजन)?',
      btnFinish: 'FoodWise में प्रवेश करें',
    },
  },
  te: {
    brand: {
      name: 'FOODWISE AI',
      tagline: 'అంచనా. నివారణ. రక్షణ.',
      offlineBadge: 'ఆఫ్‌లైన్ డెమో',
      mission: 'నిన్న మిగిలిన ఆహారాన్ని రేపటి తెలివైన నిర్ణయాలుగా మార్చండి.',
    },
    nav: {
      today: 'ఈరోజు',
      forecast: 'డిమాండ్ అంచనా',
      production: 'వంట తయారీ',
      inventory: 'సరుకుల నిల్వ',
      wasteRisk: 'వృథా ప్రమాదం',
      rescuePlan: 'ఆహార రక్షణ',
      feedback: 'మిగిలిన ఆహారం ఫీడ్‌బ్యాక్',
      experiments: 'ప్రయోగాలు',
      menu: 'స్మార్ట్ మెనూ',
      replay: 'నిర్ణయాల సమీక్ష',
      reports: 'నివేదికలు',
      settings: 'సెట్టింగ్‌లు',
    },
    header: {
      goodMorning: 'శుభోదయం',
      subheading: 'ఆహార వృథా తగ్గించడానికి ఈరోజు మీరు తెలుసుకోవాల్సిన వివరాలు.',
      addUpdateBtn: '＋ సమాచారం జోడించండి',
      somethingChangedBtn: '＋ ఏదైనా మారిందా?',
      demoTourBtn: '🎯 3-నిమిషాల డెమో కథ',
      resetDemoBtn: 'డెమో రీసెట్',
    },
    cards: {
      expectedCustomers: 'ఆశించే కస్టమర్లు',
      foodAtRisk: 'పాడయ్యే ప్రమాదంలో ఉన్న ఆహారం',
      potentialWasteAvoided: 'నివారించగల వృథా',
      potentialCostSaving: 'ఆదా కాగల సొమ్ము',
    },
    todaySection: {
      title: 'ఈరోజు నేను ఏమి చేయాలి?',
      subtitle: 'వృథా లేకుండా కస్టమర్ల డిమాండ్‌ను తీర్చే స్పష్టమైన వంటశాల చర్యలు.',
      btnAccept: 'ఆమోదించు',
      btnChange: 'మార్చు',
      btnReject: 'తిరస్కరించు',
      btnAddKnowledge: 'నా అనుభవాన్ని జోడించు',
      btnWhy: 'ఎందుకు?',
      confidence: 'ఖచ్చితత్వ విశ్వాసం',
      expectedImpact: 'అంచనా ప్రభావం',
      risksIfIgnored: 'చేయకపోతే నష్టం',
      alternatives: 'ప్రత్యామ్నాయాలు',
      wasteAvoidedPrefix: 'ఆదా చేయగల వృథా',
    },
    rescueSection: {
      title: 'ఆహార రక్షణ ప్రణాళిక (RESCUE PLAN)',
      subtitle: 'ఆహారాన్ని నేరుగా వృథా అని భావించవద్దు. ఈ క్రమంలో చర్యలు తీసుకోండి: వాడకం → తరలింపు → రాయితీ → మెనూ మార్పు → దానం → పారవేయడం.',
      tierOrderNotice: 'రక్షణ ప్రాధాన్యత: ముందు వంటలో వాడండి; వేరే దారి లేకపోతేనే పారవేయండి.',
      btnExecute: 'రక్షణ ప్రణాళిక అమలుచేయి',
      btnDetails: 'ఇతర మార్గాలు',
      tierUse: '1. వంటలో వాడండి',
      tierAllocate: '2. వేరే క్యాంటీన్‌కు పంపండి',
      tierPromote: '3. ప్రత్యేక తగ్గింపు ఇవ్వండి',
      tierRedesign: '4. కొత్త వంటకం చేయండి',
      tierRedistribute: '5. ఆకలితో ఉన్నవారికి పంచండి',
      tierDiscard: '6. పారవేయండి',
    },
    forecastSection: {
      title: 'కస్టమర్ల డిమాండ్ అంచనా',
      subtitle: 'రాబోయే రోజుల్లో కస్టమర్ల రాక మరియు భోజనాల సంఖ్య.',
      whyDifferentBtn: 'ఈరోజు అంచనా ఎందుకు భిన్నంగా ఉంది?',
      whyDifferentTitle: 'ఈరోజు కారణాలు',
      daysLabel: 'రోజులు',
      customersLabel: 'ఆశించే కస్టమర్లు',
    },
    productionSection: {
      title: 'ఈరోజు ఎంత వండాలి?',
      subtitle: 'సూత్రం: కస్టమర్ల డిమాండ్ — అందుబాటులో ఉన్న వండిన ఆహారం = వండాల్సిన మొత్తం.',
      demandLabel: 'మొత్తం డిమాండ్',
      stockLabel: 'ప్రస్తుతం ఉన్న వండిన ఆహారం',
      recommendedLabel: 'సిఫార్సు చేసిన వంట మొత్తం',
      changePrompt: 'మీరు వండాలనుకుంటున్న మోతాదు నమోదు చేయండి (కిలోలు):',
    },
    inventorySection: {
      title: 'సరుకుల జీవన చక్రం & FEFO',
      subtitle: 'ముందు గడువు తీరేది ముందే వాడండి (First Expire → First Use).',
      fefoBadge: 'FEFO విధానం అమల్లో ఉంది',
      batchLabel: 'బ్యాచ్ నంబర్',
      daysRemainingLabel: 'మిగిలిన రోజులు',
      dailyUsageLabel: 'రోజువారీ వినియోగం',
      surplusLabel: 'మిగిలిపోయే అవకాశం',
      riskLabel: 'ప్రమాద తీవ్రత',
    },
    experimentsSection: {
      title: 'AI ప్రయోగశాల',
      subtitle: 'నష్టం లేకుండా చిన్న పరీక్షలు చేసి వృథాను శాశ్వతంగా నియంత్రించండి.',
      hypothesisTitle: 'పరీక్ష వివరాలు',
      metricsTitle: 'గమనించాల్సిన అంశాలు',
      btnApprove: 'పరీక్షను ప్రారంభించు',
      btnDismiss: 'వద్దు',
      learningTitle: 'మనం ఏమి నేర్చుకున్నాం?',
    },
    menuSection: {
      title: 'స్మార్ట్ మెనూ మార్పులు',
      subtitle: 'పాడయ్యే సరుకులను రుచికరమైన రోజువారీ వంటకాలుగా మార్చండి.',
      atRiskBadge: 'మిగులు సరుకుల వినియోగం',
      wasteCutBadge: 'తగ్గే వృథా',
      btnApprove: 'నేటి మెనూలో చేర్చండి',
      btnReject: 'ఇప్పుడు వద్దు',
    },
    replaySection: {
      title: 'నిర్ణయాల సమీక్ష (AI vs మేనేజర్ vs వాస్తవం)',
      subtitle: 'AI అంచనా వేసింది ఏమిటి, మీరు నిర్ణయించింది ఏమిటి, నిజంగా ఏం జరిగింది.',
      aiPredictedCol: 'AI అంచనా',
      humanDecidedCol: 'మేనేజర్ నిర్ణయం',
      actualOutcomeCol: 'వాస్తవ ఫలితం',
      reasonCol: 'కారణం',
      learningNoteCol: 'AI నేర్చుకున్నది',
    },
    reportsSection: {
      title: 'వృథా & ఆదా నివేదికలు',
      subtitle: 'సున్నా నుండి ప్రారంభమయ్యే సాధారణ కొలతలు.',
      foodPurchased: 'కొనుగోలు చేసిన సరుకులు',
      foodPrepared: 'వండిన ఆహారం',
      foodSold: 'విక్రయించిన భోజనాలు',
      foodLeftover: 'మిగిలిన ఆహారం',
      foodWasted: 'పారవేసిన ఆహారం',
      wasteAvoided: 'వృథా కాకుండా ఆపిన ఆహారం',
      moneySaved: 'ఆదా చేసిన మొత్తం సొమ్ము',
      accuracy: 'అంచనా ఖచ్చితత్వం',
      chartTitle: '7 రోజుల ఆహార ఆదా రేఖాచిత్రం',
    },
    settingsSection: {
      title: 'సెట్టింగ్‌లు & డెమో నియంత్రణలు',
      subtitle: 'వంటశాల వివరాలు మార్చండి లేదా డెమో రీసెట్ చేయండి.',
      locationLabel: 'ప్రాంతం',
      peopleServedLabel: 'రోజువారీ కస్టమర్లు',
      resetTitle: 'డెమో రీసెట్ చేయాలా?',
      resetDesc: 'ఇది మీ అన్ని నమోదులు మరియు ప్రయోగాలను ప్రారంభ స్థితికి మారుస్తుంది.',
      resetConfirm: 'అవును, రీసెట్ చేయి',
      cancel: 'వద్దు',
    },
    firstSetup: {
      title: 'FoodWise AI కి స్వాగతం',
      subtitle: 'మీ వంటశాల కోసం సూచనలు సరిగ్గా ఇవ్వడానికి కొన్ని వివరాలు తెలపండి.',
      qPeople: 'రోజుకు ఎంతమందికి భోజనం పెడతారు?',
      qMeals: 'ఏ సమయాల్లో భోజనాలు ఉంటాయి?',
      qLocation: 'మీ ప్రాంతం ఏమిటి?',
      qLocalInfo: 'ఈరోజు ఏదైనా స్థానిక విశేషం లేదా వర్షం ఉందా?',
      btnFinish: 'FoodWise లోకి ప్రవేశించండి',
    },
  },
};
