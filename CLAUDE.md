# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **TestOps Custom Report** UI prototype application - a Next.js 15 web application designed to create a business-friendly abstraction layer over Apache Superset for QA/testing teams. The application translates complex data visualization tasks into intuitive business workflows for test execution reporting and analytics.

## Plan & Review

### Before starting work
- Always in plan mode to make a plan
- You must get context from requirement/ folder, which contains Business Context, User Journey, and relevant references.
- After get the plan, make sure you Write the plan to • claude/tasks/TASK_NAME. md.
- The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
- If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for research)
- Don't over plan it, the purpose is to build UI prototype to demonstrate the new flow and feature capabilities, so we need to focus on the frontend side only, and be efficient in the way we plan, ultilizing mock data, and don't plan for backend nor performance.
- Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing
- You should update the plan as you work.
- After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.

## Core Architecture

**Technology Stack:**
- **Frontend Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **UI Components**: Configured for shadcn/ui (New York style)
- **Build Tool**: Next.js with Turbopack for development
- **Fonts**: Geist Sans and Geist Mono

**Key Design Patterns:**
- Uses Next.js App Router (not Pages Router) - all routes in `/app` directory
- Component-first architecture with shadcn/ui configuration
- Tailwind utility-first CSS with CSS variables for theming
- TypeScript path aliases configured: `@/` maps to root directory

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build with Turbopack (preferred for testing)
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Geist fonts
│   ├── page.tsx           # Home page
│   └── globals.css        # Global Tailwind styles
├── lib/                   # Shared utilities and configurations
│   └── utils.ts           # Utility functions (cn helper)
├── requirements/          # Business requirements and analysis docs
│   ├── dataset_strategy_analysis.md     # Data architecture planning
│   ├── implementation_roadmap.md        # Technical roadmap
│   └── superset_feature_analysis.md     # Superset abstraction specs
├── components.json        # shadcn/ui configuration
└── [config files]        # Next.js, TypeScript, ESLint, Tailwind configs
```

## Business Context

This application is being built to solve a specific problem: QA teams need to create test execution reports and analytics but find Apache Superset too complex and technical. The solution provides:

1. **Business-Friendly Interface**: Abstract away Superset's technical complexity
2. **Pre-configured Templates**: Ready-made report templates for common QA use cases
3. **Smart Data Abstraction**: Hide database schemas, present business-relevant data views
4. **Guided Workflows**: Step-by-step report creation matching QA mental models

**Key Entities**: Test Cases, Test Results, Test Runs, Defects, Requirements, Configurations, and scope handling (Time/Sprint/Release).

## Configuration Details

**shadcn/ui Setup:**
- Style: "new-york" 
- Uses React Server Components (RSC)
- CSS variables enabled for theming
- Icon library: lucide-react
- Component aliases configured for organized imports

**TypeScript Configuration:**
- Strict mode enabled
- Target: ES2017
- Module resolution: bundler
- Path mapping: `@/*` resolves to root directory
- Next.js plugin enabled for enhanced development experience

**Build Configuration:**
- Uses Turbopack for both dev and build (faster compilation)
- ESLint extends Next.js core web vitals and TypeScript configs
- Standard Next.js optimizations enabled

## Development Notes

**Component Development:**
- Follow shadcn/ui patterns when creating UI components
- Use the configured path aliases (`@/lib/utils`, `@/components/ui`, etc.)
- Leverage Tailwind's utility classes with the configured CSS variables

**Data Integration:**
- The application will integrate with Superset REST APIs
- Focus on translating business requirements to technical Superset configurations
- Refer to requirements documentation for understanding expected data flows

**Styling Approach:**
- Tailwind-first with semantic CSS variables for theming
- Dark mode support configured via CSS variables
- Use Geist font family (defined in layout.tsx)