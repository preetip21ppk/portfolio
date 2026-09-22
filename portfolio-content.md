# Portfolio Content Source — Preeti Purnimaa Kannan

> Extracted verbatim from `UPDATED_SAMPLE_RESUME (4).pdf`. This file is the single source of
> truth for all copy on the portfolio site. Edit here, not in components.

## 1. Identity / Hero

| Field | Value |
|---|---|
| Name | Preeti Purnimaa Kannan |
| Email | kannan.pr@northeastern.edu |
| Phone | (857) 415-8621 |
| Location | Boston, MA |
| LinkedIn | linkedin.com/in/preeti-purnimaa |
| GitHub | github.com/preeti-purnimaa |

**Positioning:** Data Analytics Engineer / Data Scientist — end-to-end: pipelines (ETL/ELT) →
warehouse (Snowflake, Fabric, Redshift) → ML/GenAI → BI dashboards (Power BI, Tableau).

**Headline numbers (for hero stat strip):**
- 20 projects
- 14 dashboards shipped
- 4 internships
- GPA 3.91

---

## 2. Education

**Northeastern University** — Boston, MA · Sept 2024 – Aug 2026
MS, Data Analytics Engineering · GPA 3.91

**Anna University, Sri Venkateswara College of Engineering** — Chennai, India · Jun 2020 – Jun 2024
BE, Computer Science and Engineering

---

## 3. Experience (4 roles, reverse-chronological)

### 3.1 Data Science Intern — MyEdMaster (Remote, USA) · Jan 2026 – Jun 2026
- Reviewed 400+ peer-reviewed studies across 8 diet sub-domains for a proof-of-concept health recommendation engine model
- Designed Tableau dashboard tracking diet evidence quality across research domains for medical and executive stakeholders
- Engineered synthetic dataset in Python modeling diet adherence, macros, and health outcomes from literature effect sizes
- Built and validated Gradient Boosting model in scikit-learn predicting diet sub-score, supported SageMaker stacked deployment

**Stack:** Python, scikit-learn, Tableau, AWS SageMaker

### 3.2 Data Engineer Intern — Metaplore Solutions Pvt. Ltd. (Chennai, India) · Aug 2024 – Jan 2025
- Built Python and SQL ETL pipelines standardizing transaction data across 3 enterprise systems, processing 400K daily records
- Performed data profiling and anomaly detection across 3 client source systems, improving overall data quality by 18%
- Designed 5 Power BI dashboards tracking transaction delay and exception volume KRIs, cutting manual reporting effort by 15%
- Optimized SQL transformation queries and restructured 2 pipeline tables, improving compliance reporting reliability further

**Stack:** Python, SQL, Power BI

### 3.3 Data Analyst Intern — CanBrs Therapeutics (Chennai, India) · May 2023 – Jul 2023
- Consolidated raw plate-reader and HPLC exports from Azure Blob Storage into a validated Azure SQL database using Python
- Built validation logic in Python to catch missing wells, duplicate sample IDs, and out-of-range values before loading to SQL
- Modeled dose-response curves in Python to compute IC50 with 95% CI across 20+ assay batches, quantifying variability
- Delivered a Power BI dashboard with compound, batch, and timepoint drill-downs, surfacing 3 out-of-spec batches early

**Stack:** Python, Azure Blob Storage, Azure SQL, Power BI

### 3.4 Data Scientist Intern — Exposys Data Labs (Bangalore, India) · Nov 2021 – Mar 2022
- Built a multi-source ETL pipeline in Python and SQL, loading 110,000+ transaction records into a data warehouse
- Applied K-means clustering on RFM features to segment 9,600 customers into 5 behavior-driven groups for targeting
- Designed and ran a controlled A/B test on at-risk customers, applying hypothesis-driven analysis to guide outreach strategy
- Built an interactive Power BI dashboard with drill-downs by region, age, and segment to guide demographic marketing decisions

**Stack:** Python, SQL, Power BI

---

## 4. Projects (20 total)

Each entry: `id` (slug for routing), title, date, stack, category tags, bullets, headline metric.

### P01 · fortunerag
**FortuneRAG: Serverless RAG Chatbot for Financial Analysis** · Aug 2026
**Stack:** AWS Bedrock, Claude-Sonnet, Lambda, Step Functions, Glue, S3, API Gateway, Streamlit
**Tags:** GenAI/LLM, Cloud, Data Engineering
**Metric:** 7 Lambda functions · 3 REST endpoints · Bronze/Silver/Gold lake
- Architected a serverless RAG pipeline on AWS Bedrock, Claude-Sonnet, Lambda, and API Gateway for real-time financial Q&A
- Orchestrated automated ETL with AWS Step Functions and Glue, building a Bronze/Silver/Gold data pipeline in Amazon S3
- Engineered 7 Python Lambda functions and 3 REST API Gateway endpoints, fully integrated with a Streamlit web front-end
- Implemented semantic retrieval using vector embeddings on chunked live SEC filings for grounded, citation-backed LLM answers

### P02 · roas-analytics
**Cross-Channel Marketing Performance & ROAS Analytics Platform** · Jun 2026
**Stack:** Python, SQL, Snowflake, Power BI
**Tags:** Dashboard, Analytics, Data Engineering
**Metric:** $11M ad spend benchmarked · 99.3% data accuracy
- Analyzed 1,800-row multi-platform ad dataset spanning Google, Meta, and TikTok Ads across 7 countries in Python
- Built SQL validation layer auditing metric integrity and duplicate campaign records, achieving 99.3% data accuracy
- Modeled ROAS and CAC by platform in SQL, uncovering TikTok's 7.64x ROAS versus Google's 3.48x on $6.3M spend
- Delivered Power BI dashboard benchmarking $11M ad spend across platforms, guiding data-driven budget reallocation

### P03 · customer-behavior-dashboard
**Customer Behavior Analytics Dashboard** · May 2026
**Stack:** Power BI, DAX, Power Query, Excel
**Tags:** Dashboard, Analytics
**Metric:** End-to-end model → interactive BI
- Built an end-to-end customer analytics dashboard by cleaning, transforming, and modeling transactional data using Power Query and DAX to support interactive business reporting
- Implemented KPI metrics, cross-filtering, and interactive dashboards to analyze customer segmentation, purchasing behavior, revenue, sales performance, and subscription trends, enabling data-driven decision-making

### P04 · dwbi-snowflake
**End-to-End DWBI Data Integration Project** · Dec 2025
**Stack:** Snowflake, Python, SQL, Power BI
**Tags:** Data Engineering, Dashboard, Warehousing
**Metric:** Star schema · 5 dims + 1 fact · 100 stores · 6,000+ records
- Designed a full star schema in Snowflake with 5 dimension tables and a fact table across 100 store locations
- Automated generation of 6,000+ realistic test records across dimensions using Python, including customers, products, and stores
- Wrote scenario-based SQL queries in Snowflake to transform and validate data across all fact and dimension tables for accuracy
- Built a Power BI dashboard connected to Snowflake, surfacing revenue, regional performance, and customer segmentation

### P05 · weather-aqi-platform
**Live Weather and Air Quality Analytics Platform** · Dec 2025
**Stack:** Power BI, AWS S3, Glue, Athena, EC2, Python, SQL
**Tags:** Dashboard, Cloud, Data Engineering
**Metric:** 8 cities · 4 lake layers · 6 Athena views · 5-page dashboard
- Built an end-to-end AWS analytics platform ingesting hourly weather and air quality API data for 8 global cities, transforming raw JSON into curated Parquet datasets across 4 S3 data lake layers
- Created Glue catalog tables, 6 Athena reporting views, and a 5-page Power BI dashboard with AQI trends, PM2.5 monitoring, city comparison, pipeline health, and 7+ data-quality checks

### P06 · fashion-diffusion
**Fashion Product Image Generation Using Diffusion Models** · Dec 2025
**Stack:** Stable Diffusion, Kandinsky 2.2, CLIP, FID, IS
**Tags:** GenAI/LLM, Deep Learning, Computer Vision
**Metric:** 4k+ samples · 54+ tuning runs
- Built an end-to-end text-to-image pipeline by cleaning 4k+ fashion samples for Stable Diffusion model training and testing
- Performed 54+ tuning runs adjusting guidance, steps & schedulers to enhance prompt–image alignment and output quality
- Applied CLIP, FID & Inception Score to evaluate images and identified Euler with guidance=9, steps=50 as optimal config
- Benchmarked Stable Diffusion v1.5 vs Kandinsky 2.2 using CLIP scores & statistical tests to compare accuracy and stability

### P07 · financial-reporting-agent
**Intelligent Financial Reporting Agent** · Oct 2025
**Stack:** GPT-4 (RAG), LangChain, Vanna AI, Microsoft Fabric / OneLake
**Tags:** GenAI/LLM, Dashboard, Warehousing
**Metric:** 60% reduction in manual reporting time
- Architected a unified financial data warehouse on Microsoft Fabric OneLake to centralize diverse multi-source wealth data
- Implemented RAG-based GPT-4 pipelines to enable contextual, conversational financial analytics for portfolio performance
- Integrated Vanna AI text-to-SQL for natural-language querying, reducing manual financial reporting and analysis time by 60%
- Delivered an interactive insights dashboard offering real-time trends and comprehensive data-driven investment intelligence

### P08 · multimodal-food-rag
**Multimodal RAG-Based Food Recommendation System** · Oct 2025
**Stack:** AWS Bedrock, FAISS, Titan Embeddings, Claude-Sonnet, Streamlit, S3
**Tags:** GenAI/LLM, Computer Vision, Cloud
**Metric:** Real-time cross-modal retrieval
- Developed a multimodal RAG framework on AWS Bedrock to combine text and image data for food recommendations
- Implemented FAISS with Titan Embeddings to encode and retrieve vectors, achieving real-time context-aware menu suggestions
- Integrated Claude-Sonnet model for image summarization and semantic understanding across cross-modal user queries
- Deployed an interactive Streamlit chatbot linking S3 storage and Bedrock to deliver adaptive AI-driven recommendations

### P09 · walmart-forecasting
**Walmart Sales Forecasting and Demand Analytics** · Sep 2025
**Stack:** Python, EDA, Greykite (Silverkite), Neural Prophet, Flask
**Tags:** Machine Learning, Forecasting
**Metric:** 45 regions forecast · RMSE/MAPE benchmarked
- Performed EDA and preprocessing on Walmart sales data using pandas and seaborn to identify trends, seasonality, and outliers
- Engineered temporal features and applied Greykite and Neural Prophet models to forecast weekly store sales across 45 regions
- Assessed Silverkite and Neural Prophet models using RMSE and MAPE metrics, improving forecasting accuracy and reliability
- Built an ML pipeline in Python for data loading, training, and Flask deployment, ensuring reusable and scalable forecasting

### P10 · elt-dbt-airflow
**ELT Orders Data Pipeline with dbt, Snowflake, and Airflow** · Aug 2025
**Stack:** Python, SQL, dbt, Snowflake, Airflow (Astronomer Cosmos), Docker
**Tags:** Data Engineering, Orchestration
**Metric:** 5 dbt models · 3 layers · 6 dbt tests
- Architected end-to-end ELT pipeline with dbt, Snowflake, and Airflow, orchestrating 5 models across 3 layers
- Automated daily orchestration via Airflow DAG using Astronomer Cosmos, auto-generating tasks from all 5 dbt models
- Modeled TPCH order data in dbt, joining staging sources into intermediate and fact tables to compute order sales metrics
- Enforced data quality with 6 dbt tests spanning generic and singular checks, validating uniqueness, nulls, and dates

### P11 · celebrity-detection
**Multi-Class Celebrity Detection and Classification System** · Aug 2025
**Stack:** Python, YOLOv8, VGG16, ResNet50, CelebA
**Tags:** Computer Vision, Deep Learning
**Metric:** 98.3% mAP detection · 47 classes · 7,050 images
- Built CNN-based celebrity recognition system using YOLOv8 on CelebA dataset, achieving 98.3% mAP for detection
- Engineered balanced dataset of 7,050 augmented images across 47 classes to eliminate data imbalance issues
- Implemented transfer learning with VGG16/ResNet50, improving classification accuracy from 28.6% to 60%
- Generated synthetic multi-celebrity images via augmentation, enabling 95%+ confidence object detection

### P12 · app-store-analysis
**Google Play Store & App Store Analysis Project** · Aug 2025
**Stack:** Python, Pandas, Matplotlib, Tableau
**Tags:** Dashboard, Analytics
**Metric:** Platform-launch recommendation
- Analyzed Google Play & App Store datasets using Python to compare ratings and reviews for launch-platform selection
- Identified high-growth categories by evaluating ratings, engagement trends, and install patterns to guide app strategy
- Assessed pricing models by comparing free vs paid adoption, revenue signals, and sentiment to optimize monetization choices
- Built Tableau dashboards visualizing review–install correlations to provide clear platform-launch recommendations

### P13 · california-wildfires
**California Wildfires Prediction & Analysis** · Jun 2025
**Stack:** Python, Pandas, PostgreSQL, Tableau, ML
**Tags:** Machine Learning, Dashboard, Analytics
**Metric:** 71% accuracy · 1,636+ fires · 7 years of data
- Built logistic regression model predicting California wildfires with 71% accuracy using Python and Pandas on 1,636+ fires
- Analyzed weather-fire correlations using PostgreSQL, identifying peak wildfire months through statistical analysis
- Engineered ETL pipeline processing 7 years of wildfire data, integrating weather APIs for feature enrichment
- Designed Tableau dashboards visualizing 4,000+ acres burned across counties, driving data-driven wildfire insights

### P14 · amazon-prime-dashboard
**Amazon Prime Movies & TV Shows Analytics Dashboard** · Jun 2025
**Stack:** Power BI, DAX, Power Query, Excel
**Tags:** Dashboard, Analytics
**Metric:** 9K+ titles modeled
- Built an end-to-end Power BI dashboard by transforming and modeling 9K+ Amazon Prime Movies & TV Shows records, creating an analytics-ready dataset using Power Query and DAX
- Implemented interactive dashboards with KPIs, slicers, and drill-through visualizations to analyze content distribution by genre, rating, release year, country, and type, improving business reporting and user exploration

### P15 · rfm-segmentation
**Customer Segmentation and Behavioral Analytics** · Feb 2025
**Stack:** Python, Matplotlib, Seaborn, RFM Framework, K-Means
**Tags:** Machine Learning, Analytics
**Metric:** 3 segments · +25% targeting improvement
- Performed RFM-based segmentation on eCommerce data, identifying high-value and dormant customers for retention
- Applied K-Means clustering on standardized RFM scores, uncovering 3 customer segments that improved targeting by 25%
- Visualized trends using bar charts, scatter plots, and heatmaps to reveal purchasing and seasonal behavior patterns
- Delivered marketing recommendations by profiling clusters, enabling personalized engagement and higher ROI

### P16 · eeg-seizure-detection
**EEG Seizure Detection Using Deep Learning** · Jan 2025
**Stack:** Python, TensorFlow, Keras, CHB-MIT, Bonn EEG
**Tags:** Deep Learning, Healthcare
**Metric:** 1M+ EEG signals · CNN–RNN hybrid
- Preprocessed 1M+ EEG signals from CHB-MIT and Bonn datasets to extract temporal and spectral features for seizure analysis
- Developed CNN–RNN hybrid model in Python/TensorFlow, achieving strong accuracy across cross-validated seizure detection
- Designed experimental pipeline with cross-validation and error analysis to compare models and improve generalisation
- Delivered prototype enabling early seizure alerts, supporting neurologist decision-making and real-time monitoring

### P17 · geospatial-crash-analysis
**Geospatial Data Analysis and Interactive Visualization** · Jan 2025
**Stack:** Python, GeoPandas, Plotly, Scikit-learn, AWS S3
**Tags:** Dashboard, Analytics, Cloud
**Metric:** 51K+ crash incidents · DBSCAN hotspots
- Analyzed 51K+ high-severity crash incidents in Tempe using GeoPandas to map spatial hotspots and identify risk corridors
- Applied DBSCAN clustering and temporal trend analysis to uncover patterns linked to weather, time, and location factors
- Built interactive Plotly dashboards with animated heatmaps, treemaps, and 3D hexbin maps for dynamic crash visualization
- Deployed AWS S3-hosted geospatial dashboards, enabling policymakers to make data-driven, proactive transportation decisions

### P18 · airport-performance
**Airport Performance Optimization** · Dec 2024
**Stack:** MySQL, MongoDB, Python, UML, EER Modeling, Power BI
**Tags:** Dashboard, Data Engineering, Warehousing
**Metric:** Multi-terminal real-time KPI tracking
- Analyzed airport operations data to identify inefficiencies and optimize real-time KPI tracking across multiple terminals, while designing scalable SQL/NoSQL database schemas using UML and EER modeling and automating Python ETL workflows to streamline performance reporting
- Developed interactive Power BI dashboards to visualize flight delays, passenger throughput, and on-time performance metrics, improving data accuracy, reducing reporting delays, and enabling faster decision-making for airport management

### P19 · saac-mental-health-chatbot
**AI/ML Mental Health Chatbot (SAAC)** · Apr 2024
**Stack:** Python, NLP, Keras, TensorFlow, Web Speech API
**Tags:** NLP, Deep Learning, Healthcare
**Metric:** 92% intent-classification accuracy
- Engineered an NLP-based mental health chatbot (SAAC) using Keras and TensorFlow, offering 24/7 personalized support
- Crafted a user-friendly interface with text and voice input via Web Speech API, enhancing accessibility
- Achieved 92% accuracy in intent classification, ensuring precise user interactions and effective mental health support
- Enabled chat history tracking, improving follow-up care and continuous user engagement

### P20 · 3d-pose-ergonomics
**Real-Time 3D Human Pose Estimation for Ergonomics** · Jan 2024
**Stack:** Python, YOLOv8x-pose, MediaPipe, Deep Learning
**Tags:** Computer Vision, Deep Learning, Healthcare
**Metric:** 91.2% mAP · 500K+ keypoints
- Built 3D posture estimation system using YOLOv8x-pose & MediaPipe, achieving 91.2% mAP for ergonomic monitoring
- Processed 500K+ kinematic keypoints to classify posture deviations and detect poor ergonomic alignment across frames
- Integrated live on-screen posture alerts to notify users during prolonged misalignment, reducing ergonomic strain risk
- Enhanced workplace health compliance by enabling real-time correction for text-neck and musculoskeletal disorder prevention

---

## 5. Dashboard Inventory (14 distinct builds)

For a dedicated "Dashboards" gallery page.

| # | Dashboard | Tool | Source | Domain | What it shows |
|---|---|---|---|---|---|
| D01 | Diet evidence quality tracker | Tableau | MyEdMaster | Health research | Evidence quality across 8 diet research domains, for medical + exec stakeholders |
| D02 | Transaction delay & exception KRIs (×5) | Power BI | Metaplore | FinOps / compliance | Delay + exception volume KRIs; cut manual reporting effort 15% |
| D03 | Assay QC drill-down | Power BI | CanBrs | Pharma / lab | Compound, batch, timepoint drill-downs; flagged 3 out-of-spec batches |
| D04 | Customer demographics & segments | Power BI | Exposys | Retail marketing | Drill-downs by region, age, segment |
| D05 | Cross-channel ROAS benchmark | Power BI | P02 | Ad marketing | $11M spend across Google/Meta/TikTok, 7 countries; ROAS & CAC |
| D06 | Customer behavior analytics | Power BI | P03 | Retail | Segmentation, purchasing behavior, revenue, subscription trends |
| D07 | DWBI retail star-schema BI | Power BI ← Snowflake | P04 | Retail | Revenue, regional performance, customer segmentation, 100 stores |
| D08 | Weather & air quality (5 pages) | Power BI ← Athena | P05 | Environmental | AQI trends, PM2.5, city comparison, pipeline health, 7+ DQ checks |
| D09 | Financial insights / wealth | Fabric dashboard | P07 | Finance | Real-time portfolio trends, investment intelligence |
| D10 | App store launch analysis | Tableau | P12 | Product strategy | Review–install correlation, platform-launch recommendation |
| D11 | California wildfire analysis | Tableau | P13 | Climate / public safety | 4,000+ acres burned by county, peak-month analysis |
| D12 | Amazon Prime content analytics | Power BI | P14 | Media / OTT | 9K+ titles by genre, rating, year, country, type; KPI + drill-through |
| D13 | Tempe crash geospatial dashboards | Plotly on AWS S3 | P17 | Transportation | Animated heatmaps, treemaps, 3D hexbin, hotspot corridors |
| D14 | Airport operations KPIs | Power BI | P18 | Aviation | Flight delays, passenger throughput, on-time performance |

**Tool split:** Power BI ×9 · Tableau ×3 · Plotly ×1 · Microsoft Fabric ×1

---

## 6. Skills (verbatim groupings)

- **Programming & Querying:** Python (NumPy, Pandas, Scikit-learn, GeoPandas), SQL, NoSQL, PySpark, Spark SQL, C
- **AI Frameworks & Libraries:** PyTorch, TensorFlow, Transformers, Diffusers, OpenCV, spaCy
- **LLM & NLP:** GPT-4, LangChain, RAG Pipelines, Vanna AI, Web Speech API, Intent Classification, Prompt Engineering
- **Data Visualization:** Tableau, Power BI, Looker, MS Excel (Advanced, VBA, Power Query), Canva, Datawrapper
- **Data Engineering:** ETL/ELT, Airflow, dbt, Snowflake, Streamlit, FastAPI
- **Cloud & Infrastructure:** AWS (S3, Redshift, Glue, Athena, Lambda, QuickSight), Docker, Databricks

---

## 7. Site filter taxonomy (derived)

Category chips for the projects grid:

| Category | Project IDs | Count |
|---|---|---|
| GenAI / LLM | P01, P06, P07, P08 | 4 |
| Dashboards & BI | P02, P03, P04, P05, P07, P12, P13, P14, P17, P18 | 10 |
| Data Engineering | P01, P02, P04, P05, P10, P18 | 6 |
| Machine Learning | P09, P13, P15 | 3 |
| Computer Vision | P06, P08, P11, P20 | 4 |
| Deep Learning | P06, P11, P16, P19, P20 | 5 |
| Cloud (AWS/Azure/Fabric) | P01, P05, P08, P17 | 4 |
| Healthcare | P16, P19, P20 | 3 |

---

## 8. Open items to resolve before/while building

1. **GitHub repo links** — no per-project URLs on the resume. Need a repo link (or "private") per project.
2. **Dashboard screenshots** — a dashboards gallery is much stronger with images. Need PNG exports.
3. **Live demo links** — Streamlit apps (P01, P08), S3-hosted Plotly (P17), Flask app (P09) may have URLs.
4. **Headshot / photo** — optional but recommended for the About section.
5. **Resume PDF** — should be downloadable from the site; copy it into `/public`.
6. **Date ordering note** — P03 (May 2026) and P02 (Jun 2026) sit between the 2025 entries in the resume;
   the site will sort strictly by date, which changes display order vs. the PDF.
