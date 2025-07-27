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

export interface WakatimeStatsResponse {
  data: {
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
