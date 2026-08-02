import React, { useState } from 'react';
import { Terminal, Copy, Check, FileCode, Container, GitBranch } from 'lucide-react';

export const DevOpsView: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const DOCKERFILE_CONTENT = `# Multi-stage Dockerfile for Movie Book Application

# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build app
COPY . .
RUN npm run build

# Stage 2: Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built dist files and package configs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Run Express server
CMD ["node", "dist/server.cjs"]`;

  const DOCKER_COMPOSE_CONTENT = `version: '3.8'

services:
  movie-book-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    restart: always`;

  const GITHUB_ACTIONS_CONTENT = `name: CI/CD Pipeline - Movie Book Application

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Node.js 20
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run Type Check & Linter
      run: npm run lint

    - name: Build Application
      run: npm run build
      env:
        NODE_ENV: production

  docker-build:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Build Docker Image
      run: |
        docker build -t cinelib-app:\${{ github.sha }} .`;

  const copyToClipboard = (text: string, fileName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          <Terminal className="w-3.5 h-3.5" />
          DevOps & Container Artifacts
        </div>
        <h1 className="text-2xl font-black text-white">CI/CD Pipeline & Docker Containerization</h1>
        <p className="text-xs text-slate-400">
          Ready-to-use production scripts for GitHub Actions automated build/test workflows and container deployment.
        </p>
      </div>

      {/* Grid of Files */}
      <div className="space-y-6">
        
        {/* Dockerfile Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Container className="w-4 h-4 text-cyan-400" />
              Dockerfile
            </h3>
            <button
              onClick={() => copyToClipboard(DOCKERFILE_CONTENT, 'Dockerfile')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copiedFile === 'Dockerfile' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedFile === 'Dockerfile' ? 'Copied!' : 'Copy Dockerfile'}
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
            {DOCKERFILE_CONTENT}
          </pre>
        </div>

        {/* docker-compose.yml Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Container className="w-4 h-4 text-amber-400" />
              docker-compose.yml
            </h3>
            <button
              onClick={() => copyToClipboard(DOCKER_COMPOSE_CONTENT, 'docker-compose.yml')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copiedFile === 'docker-compose.yml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedFile === 'docker-compose.yml' ? 'Copied!' : 'Copy docker-compose.yml'}
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 text-amber-300 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
            {DOCKER_COMPOSE_CONTENT}
          </pre>
        </div>

        {/* GitHub Actions CI/CD Workflow */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              .github/workflows/ci-cd.yml
            </h3>
            <button
              onClick={() => copyToClipboard(GITHUB_ACTIONS_CONTENT, 'ci-cd.yml')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copiedFile === 'ci-cd.yml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedFile === 'ci-cd.yml' ? 'Copied!' : 'Copy Workflow'}
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 text-indigo-300 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
            {GITHUB_ACTIONS_CONTENT}
          </pre>
        </div>

      </div>

    </div>
  );
};
