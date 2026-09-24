// Base interfaces cho Wakatime API responses
export interface WakatimeLanguage {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface WakatimeProject {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
}

export interface WakatimeEditor {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
}

export interface WakatimeCategory {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
}

export interface WakatimeOperatingSystem {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
}

export interface WakatimeRange {
  start: string;
  start_date: string;
  start_text: string;
  end: string;
  end_date: string;
  end_text: string;
  timezone: string;
  text: string;
}

export interface WakatimeAiModelBreakdown {
  /** AI model name */
  name: string;
  /** number of lines added or removed by this AI model */
  lines: number;
  /** estimated USD cost for this AI model */
  cost: number;
}

/** AI fields returned by the stats endpoint (null when not tracked) */
export interface WakatimeAiStats {
  ai_additions?: number | null;
  ai_deletions?: number | null;
  human_additions?: number | null;
  human_deletions?: number | null;
  ai_line_changes_total?: number | null;
  ai_model_breakdown?: WakatimeAiModelBreakdown[] | null;
  ai_model_total_cost?: number | null;
  ai_input_tokens?: number | null;
  ai_cached_input_tokens?: number | null;
  ai_output_tokens?: number | null;
  ai_prompt_length_avg?: number | null;
  ai_prompt_events_total?: number | null;
  ai_prompt_events_avg_per_session?: number | null;
  ai_sessions?: number | null;
}

export interface WakatimeStatsResponse {
  data: WakatimeAiStats & {
    total_seconds: number;
    human_readable_total: string;
    daily_average: number;
    human_readable_daily_average: string;
    is_up_to_date: boolean;
    range: WakatimeRange;
    languages: WakatimeLanguage[];
    projects: WakatimeProject[];
    editors: WakatimeEditor[];
    categories: WakatimeCategory[];
    operating_systems: WakatimeOperatingSystem[];
  };
}

export interface WakatimeAllTimeResponse {
  data: {
    daily_average: number;
    decimal: string;
    digital: string;
    is_up_to_date: boolean;
    percent_calculated: number;
    range: WakatimeRange;
    text: string;
    timeout: number;
    total_seconds: number;
  };
}

export interface WakatimeStatsData {
  stats: {
    last_7_days: WakatimeApiResponse;
    last_30_days: WakatimeApiResponse;
    last_6_months: WakatimeApiResponse;
    last_year: WakatimeApiResponse;
    all_time: WakatimeApiResponse;
  };
  allTimeData: WakatimeAllTimeApiResponse;
  lastUpdated: string;
}

// Error response type
export interface WakatimeErrorResponse {
  error: string;
}

// Union type for API responses
export type WakatimeApiResponse = WakatimeStatsResponse | WakatimeErrorResponse;
export type WakatimeAllTimeApiResponse =
  | WakatimeAllTimeResponse
  | WakatimeErrorResponse;

// Type guards
export function isWakatimeError(
  response: WakatimeApiResponse
): response is WakatimeErrorResponse {
  return "error" in response;
}

export function isWakatimeAllTimeError(
  response: WakatimeAllTimeApiResponse
): response is WakatimeErrorResponse {
  return "error" in response;
}
