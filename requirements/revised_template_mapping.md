# Revised Use Case Templates - Dataset & Scope Mapping

## Executive Summary

The revised templates are strategically designed around our **4 Dataset Architecture** and **Scope Handling System**, providing optimal performance while hiding Superset complexity. Each template is mapped to specific datasets and includes intelligent scope recommendations.

---

## Template-to-Dataset Architecture

### **🔵 Test Execution Dataset Templates**
*Primary dataset: `test_execution_dataset`*

#### **1. Test Execution Performance**
```typescript
Template Config: {
  dataset: "test_execution_dataset",
  chartType: "mixed_timeseries", // Line + Bar combination
  primaryMetric: "AVG(duration)",
  secondaryMetric: "COUNT(*)", 
  groupBy: ["test_type", "DATE_TRUNC('day', start_time)"],
  optimalScope: "time", // Best for time-series analysis
  scopeSupport: ["time", "sprint", "release"],
  preFilters: ["tc.status = 'Published'"] // Only published test cases
}
```

**Business Translation:**
```
User sees: "Average execution time trends"
System generates: AVG(duration) GROUP BY test_type, DATE_TRUNC('day', start_time)

User sees: "Compare manual vs automated" 
System generates: WHERE test_type IN ('manual', 'automated')
```

**Scope Implementation:**
- **Time Scope:** `start_time BETWEEN date_range` (Optimal - direct field)
- **Sprint Scope:** `sprint_id = 'selected_sprint'` + date boundaries 
- **Release Scope:** `release_id = 'selected_release'`

---

#### **2. Quality Trends & Pass Rate Analysis**
```typescript
Template Config: {
  dataset: "test_execution_dataset",
  chartType: "stacked_bar_with_line",
  metrics: {
    bars: "COUNT(*) GROUP BY status",
    line: "(SUM(is_passed)/COUNT(*)) * 100" // Pass rate percentage
  },
  optimalScope: "sprint", // Perfect for sprint reviews
  scopeSupport: ["time", "sprint", "release"],
  calculations: {
    pass_rate: "CASE WHEN status = 'Passed' THEN 1 ELSE 0 END"
  }
}
```

**Advanced Logic:**
```sql
-- Pre-calculated in dataset for performance
SELECT 
  DATE_TRUNC('day', start_time) as execution_date,
  COUNT(*) as total_executions,
  SUM(CASE WHEN status = 'Passed' THEN 1 ELSE 0 END) as passed_count,
  ROUND((SUM(CASE WHEN status = 'Passed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) as pass_rate
FROM test_execution_dataset
WHERE {scope_filter}
GROUP BY DATE_TRUNC('day', start_time)
```

---

#### **3. Test Infrastructure & Resource Health**
```typescript
Template Config: {
  dataset: "test_execution_dataset", 
  chartType: "gauge_and_heatmap",
  metrics: {
    concurrency: "COUNT(DISTINCT session_id)",
    resource_utilization: "AVG(concurrent_sessions)",
    environment_performance: "AVG(duration) GROUP BY environment"
  },
  optimalScope: "time", // Real-time operational monitoring
  refreshRate: "5_minutes" // More frequent updates for ops
}
```

---

#### **4. Configuration Coverage Matrix**
```typescript
Template Config: {
  dataset: "test_execution_dataset",
  chartType: "matrix_heatmap",
  dimensions: ["os", "browser", "browser_version"],
  metric: "COUNT(DISTINCT test_case_id)", // Unique tests per config
  optimalScope: ["sprint", "release"], // Scope-based coverage analysis
  visualization: {
    colorScale: "sequential",
    showMissing: true // Highlight uncovered configurations
  }
}
```

---

### **🟢 Requirement Coverage Dataset Templates**
*Primary dataset: `requirement_coverage_dataset`*

#### **5. Requirement Coverage & Test Readiness**
```typescript
Template Config: {
  dataset: "requirement_coverage_dataset",
  chartType: "progress_bars_with_breakdown",
  metrics: {
    test_coverage: "(COUNT(DISTINCT CASE WHEN has_published_test = 1 THEN req.id END) / COUNT(DISTINCT req.id)) * 100",
    execution_coverage: "(COUNT(DISTINCT CASE WHEN latest_execution_status IS NOT NULL THEN req.id END) / COUNT(DISTINCT req.id)) * 100", 
    pass_coverage: "(COUNT(DISTINCT CASE WHEN latest_execution_status = 'Passed' THEN req.id END) / COUNT(DISTINCT req.id)) * 100"
  },
  optimalScope: ["sprint", "release"], // Perfect for iteration planning
  complexLogic: true // Requires sophisticated requirement-test relationship handling
}
```

**Complex Business Logic:**
```sql
-- This complex logic is hidden from users but auto-generated
WITH requirement_status AS (
  SELECT 
    req.id,
    req.release_id,
    req.sprint_id,
    COUNT(CASE WHEN tc.status = 'Published' THEN 1 END) as published_tests,
    COUNT(CASE WHEN latest_result.status = 'Passed' THEN 1 END) as passed_tests,
    COUNT(tc.id) as total_linked_tests
  FROM requirements req
  LEFT JOIN test_case_requirements tcr ON req.id = tcr.requirement_id  
  LEFT JOIN test_cases tc ON tcr.test_case_id = tc.id
  LEFT JOIN LATERAL (...) latest_result ON true
  WHERE {scope_filter}
  GROUP BY req.id, req.release_id, req.sprint_id
),
coverage_summary AS (
  SELECT 
    COUNT(*) as total_requirements,
    COUNT(CASE WHEN published_tests > 0 THEN 1 END) as covered_requirements,
    COUNT(CASE WHEN passed_tests = total_linked_tests AND total_linked_tests > 0 THEN 1 END) as fully_passed_requirements
  FROM requirement_status
)
SELECT 
  ROUND((covered_requirements * 100.0 / total_requirements), 1) as test_coverage_percent,
  ROUND((fully_passed_requirements * 100.0 / total_requirements), 1) as pass_coverage_percent
FROM coverage_summary;
```

---

### **🟡 Defect Analysis Dataset Templates**
*Primary dataset: `defect_analysis_dataset`*

#### **6. Defect Intelligence & Resolution Analysis**
```typescript
Template Config: {
  dataset: "defect_analysis_dataset", 
  chartType: "dual_axis_combo", // Creation trends + Resolution time analysis
  metrics: {
    creation_rate: "COUNT(*) WHERE created_date",
    resolution_rate: "COUNT(*) WHERE resolved_date IS NOT NULL",
    avg_resolution_time: "AVG(resolved_date - created_date)",
    open_critical: "COUNT(*) WHERE is_open = 1 AND is_blocking = 1"
  },
  optimalScope: "time", // Trend analysis over time
  groupBy: ["DATE_TRUNC('week', created_date)", "priority"]
}
```

**Smart Defect Categorization:**
```sql
-- Pre-calculated fields in dataset
CASE WHEN priority IN ('Critical', 'High') THEN 1 ELSE 0 END as is_blocking,
CASE WHEN resolved_date IS NULL THEN 1 ELSE 0 END as is_open,
EXTRACT(DAY FROM (resolved_date - created_date)) as resolution_days
```

---

### **🟣 Test Case Management Dataset Templates**  
*Primary dataset: `test_case_management_dataset`*

#### **7. Test Case Activity & Team Productivity**
```typescript
Template Config: {
  dataset: "test_case_management_dataset",
  chartType: "activity_timeline", // Stacked bars showing activity by user
  metrics: {
    creation_count: "COUNT(*) WHERE created_date",
    modification_count: "COUNT(*) WHERE updated_date > created_date", 
    automation_rate: "(COUNT(CASE WHEN type IN ('Automated', 'Manual & Automated') THEN 1 END) / COUNT(*)) * 100"
  },
  optimalScope: "time", // Activity tracking over time
  groupBy: ["author", "DATE_TRUNC('week', updated_date)"]
}
```

---

### **🔗 Multi-Dataset Templates**
*Uses multiple datasets with intelligent joins*

#### **8. Cross-Entity Quality Intelligence**
```typescript
Template Config: {
  datasets: ["requirement_coverage_dataset", "defect_analysis_dataset", "test_execution_dataset"],
  chartType: "bubble_matrix", // X: Coverage, Y: Defect density, Size: Test volume
  joinStrategy: "requirement_based", // Join on requirement_id
  metrics: {
    coverage_percent: "FROM requirement_coverage_dataset",
    defect_density: "FROM defect_analysis_dataset", 
    test_volume: "FROM test_execution_dataset"
  },
  optimalScope: ["sprint", "release"], // Cross-analysis by scope
  complexity: "high" // Requires sophisticated query orchestration
}
```

**Multi-Dataset Query Strategy:**
```sql
-- System generates complex multi-dataset query
WITH coverage_metrics AS (
  SELECT requirement_id, coverage_percent FROM requirement_coverage_dataset WHERE {scope}
),
defect_metrics AS (
  SELECT requirement_id, COUNT(*) as defect_count FROM defect_analysis_dataset WHERE {scope} GROUP BY requirement_id
),
execution_metrics AS (
  SELECT tc.requirement_id, COUNT(*) as test_volume 
  FROM test_execution_dataset te JOIN test_cases tc ON te.test_case_id = tc.id 
  WHERE {scope} GROUP BY tc.requirement_id
)
SELECT 
  cm.coverage_percent,
  COALESCE(dm.defect_count, 0) as defects,
  COALESCE(em.test_volume, 0) as volume
FROM coverage_metrics cm
LEFT JOIN defect_metrics dm ON cm.requirement_id = dm.requirement_id  
LEFT JOIN execution_metrics em ON cm.requirement_id = em.requirement_id;
```

---

## Scope Handling by Template

### **Optimal Scope Recommendations:**

| **Template** | **Optimal Scope** | **Why Optimal** | **Alternative Scopes** |
|--------------|------------------|------------------|----------------------|
| **Execution Performance** | Time | Time-series trends show performance patterns | Sprint (capacity), Release (regression) |
| **Quality Trends** | Sprint | Sprint reviews focus on iteration quality | Time (continuous), Release (milestone) |  
| **Coverage Readiness** | Sprint/Release | Planning and readiness assessment | Time (progress tracking) |
| **Defect Intelligence** | Time | Defect trends emerge over time periods | Sprint (iteration focus) |
| **Test Case Activity** | Time | Activity tracking is time-based | Sprint (iteration planning) |
| **Cross-Entity Analysis** | Sprint/Release | Strategic analysis by delivery milestone | Time (trend analysis) |
| **Infrastructure Health** | Time | Operational monitoring is time-centric | Sprint (capacity planning) |
| **Configuration Matrix** | Sprint/Release | Coverage assessment by delivery scope | Time (gap tracking) |

### **Scope Translation Examples:**

```typescript
// User selects: "Sprint 7" for "Quality Trends"
ScopeHandler.translate({
  template: "quality_trends",
  scope: { type: "sprint", value: "sprint_7_id", label: "Sprint 7" }
})

// Generates:
{
  filters: [
    { col: "sprint_id", op: "==", val: "sprint_7_id" },
    { col: "start_time", op: ">=", val: "2024-03-01" }, // Sprint boundaries
    { col: "start_time", op: "<", val: "2024-04-01" }
  ],
  cacheKey: "quality_trends_sprint_sprint_7_id",
  cacheTTL: 3600 // 1 hour for sprint data
}
```

---

## Performance Optimization by Template

### **Query Performance Characteristics:**

| **Template** | **Dataset Size** | **Query Complexity** | **Cache TTL** | **Expected Response** |
|--------------|------------------|---------------------|---------------|---------------------|
| **Execution Performance** | Large (10K-100K rows) | Medium (aggregation) | 5 minutes | < 3 seconds |
| **Quality Trends** | Large (10K-100K rows) | Medium (grouping) | 5 minutes | < 3 seconds |
| **Coverage Readiness** | Medium (1K-10K rows) | High (complex joins) | 1 hour | < 5 seconds |
| **Defect Intelligence** | Medium (1K-5K rows) | Medium (time calc) | 15 minutes | < 2 seconds |
| **Test Case Activity** | Medium (1K-10K rows) | Low (simple agg) | 30 minutes | < 2 seconds |
| **Cross-Entity Analysis** | Large (multi-dataset) | Very High (complex) | 1 hour | < 10 seconds |
| **Infrastructure Health** | Large (10K-50K rows) | Medium (concurrent) | 5 minutes | < 4 seconds |
| **Configuration Matrix** | Medium (5K-20K rows) | High (multi-dim) | 1 hour | < 6 seconds |

### **Caching Strategy by Template:**

```typescript
const CacheConfig = {
  execution_performance: { ttl: 300, key: "exec_perf_{scope}_{filters}" },
  quality_trends: { ttl: 300, key: "quality_{scope}_{date_range}" },
  coverage_readiness: { ttl: 3600, key: "coverage_{scope}" }, // Stable data
  defect_intelligence: { ttl: 900, key: "defect_{scope}_{time_range}" },
  testcase_productivity: { ttl: 1800, key: "activity_{scope}_{author}" },
  cross_entity_analysis: { ttl: 3600, key: "cross_{scope}_complex" },
  operational_health: { ttl: 300, key: "ops_{time_range}" }, // Real-time needs
  configuration_matrix: { ttl: 3600, key: "config_{scope}" } // Stable coverage
}
```

---

## Implementation Priority for PoC

### **Phase 1: Core Templates (Week 1-2)**
```
✅ Test Execution Performance (highest impact, simplest)
✅ Quality Trends & Pass Rate (essential for demos)  
✅ Basic scope handling (Time + Sprint)
```

### **Phase 2: Coverage Templates (Week 3-4)** 
```
✅ Requirement Coverage & Test Readiness (high business value)
✅ Configuration Coverage Matrix (differentiator)
✅ Enhanced scope handling (Release scope)
```

### **Phase 3: Advanced Templates (Week 5-6)**
```
✅ Defect Intelligence (complete quality picture)
✅ Test Case Activity (team productivity)
✅ Cross-Entity Analysis (strategic insights)
```

### **Phase 4: Operational Templates (Week 7-8)**
```
✅ Infrastructure Health (enterprise features)
✅ Advanced multi-dataset capabilities
✅ Performance optimization and caching
```

---

## Sales Demo Script Integration

### **Demo Flow Using Revised Templates:**

**Opening:** *"Let me show you how Katalon transforms complex data analysis into simple business questions."*

**Template 1 - Test Execution Performance:**
- User selects template → *"I want to analyze test performance"*
- Scope selection → *"For the last 30 days"*  
- Instant chart → *"Here's your automation ROI - 5x faster execution times"*

**Template 2 - Coverage Readiness:**
- Template → *"Release readiness assessment"*
- Scope → *"Release 2.1"*
- Complex coverage analysis → *"92% requirement coverage, 3 gaps identified"*

**Template 3 - Cross-Entity Intelligence:**
- Template → *"Strategic quality analysis"*
- Scope → *"Sprint 7"*
- Multi-dataset insights → *"Requirements with low coverage have 3x more defects"*

**Key Message:** *"What took 30+ minutes in traditional BI tools now takes 30 seconds, with insights you couldn't get before."*

This revised template architecture provides the perfect balance of power and simplicity, leveraging our optimal dataset strategy while completely hiding Superset's complexity behind business-focused interfaces.