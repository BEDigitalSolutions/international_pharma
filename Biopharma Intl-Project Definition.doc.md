**Purpose:** Biopharma BU -- Grifols International

> **Information Systems:**

**Main contacts for**

> Adria Marimon **this proposal:**

[Adria.Marimon@grifols.com]{.underline}

> **Global Procurement:**
>
> Pedro De Castro Garcia pedro.decastro@grifols.com

**\`**

INDEX

[1 Purpose of this project
[3](#purpose-of-this-project)](#purpose-of-this-project)

[2 Project Scope and Goals
[4](#project-scope-and-goals)](#project-scope-and-goals)

[2.1 Goals [4](#goals)](#goals)

[2.2 Scope of work [4](#scope-of-work)](#scope-of-work)

[2.2.1 In Scope [4](#in-scope)](#in-scope)

[2.2.2 Out of Scope [5](#out-of-scope)](#out-of-scope)

[3 AS IS and TO BE environment
[6](#as-is-and-to-be-environment)](#as-is-and-to-be-environment)

[3.1 Current Environment
[6](#current-environment)](#current-environment)

[3.2 To be environment [6](#to-be-environment)](#to-be-environment)

[3.3 VOLUMES and USERS [7](#volumes-and-users)](#volumes-and-users)

[4 Implementation [8](#implementation)](#implementation)

[4.1 Implementation phases and planning
[8](#implementation-phases-and-planning)](#implementation-phases-and-planning)

[4.2 Prerequisites documentation
[8](#prerequisites-documentation)](#prerequisites-documentation)

[4.3 Environments [8](#environments)](#environments)

[4.4 Knowledge transfer [8](#knowledge-transfer)](#knowledge-transfer)

[4.5 Deliverables Documentation Requirements
[8](#deliverables-documentation-requirements)](#deliverables-documentation-requirements)

[5 Economic conditions [10](#economic-conditions)](#economic-conditions)

[6 Proposal contents [11](#proposal-contents)](#proposal-contents)

[6.1 Proposal Index [11](#proposal-index)](#proposal-index)

[6.2 Minimum Content Requirements
[12](#minimum-content-requirements)](#minimum-content-requirements)

[6.3 Additional Considerations
[12](#additional-considerations)](#additional-considerations)

[7 Demo Product [13](#demo-product)](#demo-product)

[8 Proposal presentation
[14](#proposal-presentation)](#proposal-presentation)

[9 Project awarding criteria
[15](#project-awarding-criteria)](#project-awarding-criteria)

# PURPOSE OF THIS PROJECT 

The purpose of this document is to describe the current architecture,
current business needs, and get a proposal for the implementation of the
described Project.

Grifols International is the parent company, headquartered in Barcelona
Spain with several Grifols entities and interest across the globe,
collectively "Grifols". The main activity is related to the Pharma
industry, devoted to the research, development, manufacturing, and sales
of hemoderivatives, medical devices and other medicines, provided to
hospitals and patients worldwide.

Grifols develops, produces, and markets innovative medicines, solutions,
and services in more than 110 countries.

Grifols is full speed ahead on developing the next innovative
breakthroughs across multiple therapeutic areas. Grifols has more than
400 plasma donation centers spanning the U.S., Canada, Europe, and
Egypt. Grifols' industryleading quality and safety standards, begin at
our donor centers and continue throughout the manufacturing process to
ensure patients receive the highest quality medicines.

Grifols is organized in the following Business Units: Biopharma,
Diagnostic, Bio Supplies, Plasma Procurement, Others (Healthcare
Solutions). These specialized business units, with a broad and expert
knowledge in their area, are supported by the functional areas
Operations and Services.

# PROJECT SCOPE AND GOALS 

## GOALS 

The Goal of this project is to design and implement a modern, scalable,
and cost-efficient data analytics solution that enables stakeholders to
make timely, data-driven decisions. By providing a centralized platform
for analysing diverse product data, the solution will enhance visibility
into key performance indicators, uncover actionable insights, and
support strategic planning across the organization. This initiative aims
to increase informed decisionmaking, reduce manual data handling, and
improve overall operational efficiency, along reducing costs.

## SCOPE OF WORK 

The scope of this project includes the end-to-end development and
deployment of a comprehensive data management and analytics ecosystem.
The solution will be designed to support the full data lifecycle,
ensuring seamless integration, high data quality, and insightful
reporting. Key components of the scope include: **Data Ingestion:**
Automating the collection of structured and unstructured data from
multiple internal and external sources, ensuring timely and consistent
data availability.

**Data Validation**: Implementing robust validation rules and quality
checks to ensure data accuracy, completeness, and reliability before it
enters downstream systems.

**Data Transformation:** Standardizing, enriching, and aggregating data
to make it analysis-ready, using scalable and maintainable
transformation pipelines.

**Data Storage:** Establishing a secure, scalable, and high-performance
data storage architecture that supports both real-time and historical
data analysis.

**Data Visualization**: Developing interactive dashboards and visual
reports that provide intuitive access to key metrics, trends, and
anomalies, tailored to the needs of various user groups.

**Forecasting and Predictive Analytics:** Leveraging advanced
statistical models and machine learning techniques to generate
forecasts, identify patterns, and support proactive decision-making.

This project will also include user training, documentation, and support
to ensure successful adoption and longterm sustainability of the
solution.

### IN SCOPE 

The selected vendor will be responsible for:

- **Data Ingestion Workflow**

> Design and implementation of a controlled data upload process. This
> includes file data validation and error logging.

- **Automated Data Validation and Transformation**

> Development of automated routines to validate structure, normalize
> product and company names, convert units, and apply currency
> conversion from local currencies to EUR.

- **Data Lake Integration**

> Structuring and organizing validated data within the existing Azure
> Data Lake using a star schema (fact and dimension tables), stored in
> optimized formats (e.g., Parquet or Delta Lake). This includes
> partitioning, versioning, and traceability.

- **ETL/ELT Pipelines**

> Implementation of data processing pipelines to clean, transform, and
> enrich data for analytical use.

- **Dashboards**

> Creation of interactive dashboards to visualize key performance
> indicators (KPIs) such as turnover, market share, growth, and
> consumption by protein. Dashboards must support role-based access and
> automatic refresh.

- **Forecasting and Predictive Analytics**

> Optional development of forecasting models integrated into Power BI
> dashboards.

- **Documentation and Training**

> Delivery of comprehensive documentation and training for end users and
> administrators, covering data upload procedures, dashboard usage, and
> system maintenance.

- **Support and Maintenance**

> Provision of post-implementation support, including troubleshooting,
> performance monitoring, and minor enhancements.

- **The desired capabilities, but not limited to it can be found in:**

> ![](media/image1.png){width="0.33355752405949257in"
> height="0.33566054243219595in"}
>
> Assesment features.xlsx

### OUT OF SCOPE 

The following items are excluded from the scope of this project:

- Deployment of new infrastructure or platforms

- Development of custom forecasting algorithms beyond standard AutoML
  capabilities.

- Integration with external market data providers unless explicitly
  agreed upon.

# AS IS AND TO BE ENVIRONMENT 

## CURRENT ENVIRONMENT 

The current One View platform is built on a combination of FIORI, SAP.
Different users manually input volume and price data through FIORI using
Excel files. Data processing is largely manual, including validations,
normalization of names, and unit conversions. There is no automated
traceability or version control.

Data is grouped for external analysis and visualization, which has two
environments: a user platform with frozen data (as of July of the
previous year) and an administrator platform with updated data. No
forecasting or predictive analytics are currently performed. Also, the
versatility of the visualization layer is very limited.

Validations are manual, and common data issues include incorrect units,
inconsistent naming conventions, and duplicate or missing entries.
Currency conversion is done manually by subsidiaries before data entry,
with all values submitted in euros.

## TO BE ENVIRONMENT 

The proposed solution is a modern architecture based on **current
technology portfolio**, designed to automate processes, ensure full
traceability, and support scalability. The future environment will
include:

- **Data Upload Portal:** A secure interface for subsidiaries to upload
  or modify the data files.

- **Automated Validation**: Initial checks for structure, format,
  amounts, and automatic conversion like for example currency.

- **Data Processing and Cleansing**: Normalization, error detection, and
  row-level traceability.

- **Structured Storage**: Star schema with fact and dimension tables,
  stored in optimized formats (Parquet/Delta).

- **Visualization** : Interactive dashboards with key KPIs, role-based
  access control, and automated dataset refresh and autonomy to create
  new dashboards.

- **Forecasting**: Predictive models integrated into dashboards, with
  evaluation metrics and publication of results in the Data Lake.

This architecture will enable more efficient, secure, and flexible data
management, with advanced analytics and forecasting capabilities.

## VOLUMES AND USERS 

- **Data Volumes**:

- 7 years of historical data.

- 43 products.

- 135 countries.

- 126 companies.

- ≈ 731,430 data combinations per year.

- Data uploads occur 2--3 times per year per subsidiary, but the
  solution should not be limited to it.

The exact number of users per platform is to be confirmed.

# IMPLEMENTATION 

## IMPLEMENTATION PHASES AND PLANNING 

This initial implementation should cover the Biopharma Business Unit
within the different affiliates and departments located in different
sites. Grifols Business team aims to have the implementation done by the
end of April 2026.

Estimated planning must be proposed by the vendor.

## PREREQUISITES DOCUMENTATION 

The implementation should adhere to Grifols Standards and comply with
the Cloud assessment, a separate process outside the proposal.
Additionally, vendor must provide the following documentation and answer
the attached excel file. This ensures a comprehensive approach to
security and compliance. Failure to present these elements may result in
ineligibility for selection.

> ![](media/image1.png){width="0.33355752405949257in"
> height="0.33566054243219595in"}
>
> Cloud Provider Questionaire (3).xlsx

## ENVIRONMENTS 

Grifols will require a minimum of two environments to meet all
requirements, with three environments being preferable. The options,
along with their coverage and associated costs, should be thoroughly
detailed in the proposal.

## KNOWLEDGE TRANSFER 

The vendor will be responsible for the functional and technical
knowledge transfer to the Grifols team. The proposal must include the
necessary elements to guarantee a correct knowledge transfer to the
Grifols teams.

The implementation of the new data solution within Grifols is a
cross-functional initiative involving multiple departments. The project
will be led by a dedicated IT Project Manager, supported by IT Analysts
with subject matter expertise, and coordinated in close collaboration
with business stakeholders from the relevant functional areas.

The selected vendor will be expected to work within this governance
structure and ensure that all deliverables are aligned with both IT and
business requirements.

All documentation produced must be sufficiently detailed and structured
to enable Grifols teams to independently operate, maintain, and evolve
the solution after implementation. This includes technical
documentation, data flow diagrams, validation logic, user guides, and
administrative procedures.

## DELIVERABLES DOCUMENTATION REQUIREMENTS 

All documents related to the project shall be written in English.
Grifols standard editable MS Office templates shall be used for all
project deliverables, unless otherwise agreed.

The following project deliverables or similar will be required at
minimum:

- **System Requirements Specification (SRS):** Detailed documentation of
  the system's functional and nonfunctional requirements.

- **System Architecture Document:** An overview of the system's
  architecture, including hardware, software, and network components.

- **Configuration Management Plan:** Guidelines for managing changes to
  the system's configuration, ensuring consistency and traceability.

- **User Manuals and Training Materials:** Comprehensive guides and
  training resources for end-users to effectively use the system.

- **User requirements completion:**

# ECONOMIC CONDITIONS 

Specify costs per hardware, software, licenses, subscriptions,
maintenances, and services separately.

The economic proposals (licenses and services) can be presented directly
or through a partner. You should decide the best approach for Grifols.

All proposals must include proposed costs to complete the tasks
described in scope and the total effort estimated for each phase must be
detailed. In addition, the rates for additional activities not included
in this scope must be also included.

- Specify the discounts and prices for additional purchases of licenses
  or subscriptions if it applies.

- Specify maintenance and support costs for the product.

- Specify updates and new releases costs..

No over costs for tasks included in the Scope of Work agreed to will be
admitted.

In case of offering several alternatives, please specify the cost of
each one separately.

# PROPOSAL CONTENTS 

Vendors are expected to submit a comprehensive proposal that directly
addresses the use cases and user requirements provided by Grifols. The
proposal must be written in **English**, using the vendor's standard
format, and must include the following structure:

## PROPOSAL INDEX 

1.  **Introduction**

    a.  Overview of the proposed solution and its benefits

    b.  Identification of potential critical points or challenges

2.  **Proposed Solution**

    a.  General overview of the solution

    b.  Proposed architecture, aligned with Grifols' existing Azure Data
        Lake and Power BI platforms c. Requirements coverage:

        - Clear mapping of how each requirement is addressed

        - Identification of any requirements that require customization,
          including a description of how they will be implemented

        - For unmet requirements, vendors must indicate whether they are
          included in their product roadmap

> d\. Services included in the implementation

3.  **Model & Methodology**

    a.  Project governance and organization

    b.  Project plan and timeline

    c.  List of deliverables

4.  **Support Model**

> Description of the product support model, including SLAs, response
> times, and escalation procedures

5.  **Project Team**

> Roles and responsibilities of the proposed team

6.  **Financial Proposal**

> Detailed cost breakdown, including implementation, licenses (if
> applicable), support, and optional services

7.  **Annexes**

    a.  CVs of the proposed team members

    b.  Company profile and references to similar projects

    c.  Optional: Added value or differentiators

## MINIMUM CONTENT REQUIREMENTS 

The proposed solution must include, at a minimum:

- **Solution Overview**

- General description of the proposed approach

- Scalable and global design principles

- Recommendations and best practices

- **Architecture**

- Technical architecture and key design considerations

- Description of solution components and how they integrate with
  internal and external systems

- Integration methods and interface design for each component

- **Requirements Fulfillment**

- Detailed mapping of how each requirement is met

- Implementation considerations and constraints

- **Services**

- Description of services provided during implementation

- Support model, availability, response levels

- Approach to integration with other solution providers

- Policy for new releases and regulatory updates

## ADDITIONAL CONSIDERATIONS 

Vendors are encouraged to include any additional information or
components not explicitly mentioned above but deemed necessary to fully
meet Grifols' requirements and ensure long-term sustainability of the
solution

# DEMO PRODUCT 

Grifols will provide if needed specific examples of what the
expectations are for the system to provide the candidate information
enough to build a product demo where Grifols stakeholders and staff
representatives may vision and get a better understanding on how the
system can cover their current information and processes.

The product demos should meet and be tailored using the user
requirements (Excel attached).

After Demo completion an evaluation will be performed to ensure the
solution meet business needs.

The demo should be performed between the 23 and 28^th^ November.

# PROPOSAL PRESENTATION 

The Proposal Presentation is the final step in the vendor selection
process, serving as a formal discussion between the vendor and Grifols.
This crucial meeting ensures that the vendor fully comprehends Grifols'
needs and requirements. During this presentation, the vendor will:

- Demonstrate Understanding: Clearly articulate their understanding of
  Grifols' business needs, project scope, and specific requirements.

- Present Solutions: Provide a detailed overview of their proposed
  solution, highlighting how it addresses Grifols' needs and aligns with
  the project objectives.

- Use the user requirements (Excel attached and) use cases provided to
  tailor the presentation.

- Discuss Implementation: Outline the implementation plan, including
  timelines, milestones, resource allocation, and risk management
  strategies.

- Answer Questions: Address any questions or concerns from Grifols'
  team, providing clear and concise responses to ensure all aspects of
  the proposal are understood.

- Highlight Benefits: Emphasize the benefits of their solution,
  including potential improvements in efficiency, cost savings, and
  overall impact on Grifols' operations.

# PROJECT AWARDING CRITERIA 

The selection of the best proposal will be based on the following
criteria:

- **Contactable References**: Availability of references for similar
  implementations.

- **Requirements Coverage:** Extent to which the proposal meets the
  specified requirements.

- **Evaluation of Optional Requirements:** Consideration of optional
  requirements in the context of added value use cases applicable to
  Grifols.

- **Demo Alignment:** Alignment of the demonstration with Grifols'
  example data.

- **Economic Conditions:** Financial aspects of the proposal.

- **Support Conditions:** Terms and conditions of support services.

- **System Architecture and Integration Capabilities:** The robustness
  of the system architecture and its ability to integrate with existing
  systems.
