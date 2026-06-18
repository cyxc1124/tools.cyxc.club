{{/*
Expand the name of the chart.
*/}}
{{- define "tools.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "tools.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "tools.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "tools.labels" -}}
helm.sh/chart: {{ include "tools.chart" . }}
{{ include "tools.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "tools.selectorLabels" -}}
app.kubernetes.io/name: {{ include "tools.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "tools.frontend.labels" -}}
{{ include "tools.labels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{- define "tools.frontend.selectorLabels" -}}
{{ include "tools.selectorLabels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{- define "tools.api.labels" -}}
{{ include "tools.labels" . }}
app.kubernetes.io/component: api
{{- end }}

{{- define "tools.api.selectorLabels" -}}
{{ include "tools.selectorLabels" . }}
app.kubernetes.io/component: api
{{- end }}

{{- define "tools.imageTag" -}}
{{- $tag := .tag -}}
{{- if not $tag }}
{{- $tag = .defaultTag -}}
{{- end }}
{{- $tag }}
{{- end }}
