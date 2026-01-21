/**
 * Parameter Interface
 *
 * This interface defines the structure for parameterized content
 * that allows dynamic website appearance changes.
 */

export interface Parameter {
    id: string;
    key: string;
    value: string | number | boolean | object;
    type: ParameterType;
    category: ParameterCategory;
    description?: string;
    isActive: boolean;
    created_at: string;
    updated_at: string;
}

export enum ParameterType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    COLOR = "COLOR",
    JSON = "JSON",
    BASE64 = "BASE64",
    URL = "URL",
}

export enum ParameterCategory {
    THEME = "THEME",
    BRANDING = "BRANDING",
    CONTENT = "CONTENT",
    FEATURE_FLAG = "FEATURE_FLAG",
    CONTACT = "CONTACT",
}

// Request/Response types
export interface ParameterListResponse {
    parameters: Parameter[];
    total: number;
    page?: number;
    limit?: number;
}

export interface ParameterResponse {
    parameter: Parameter;
    message?: string;
}

export interface UpdateParameterRequest {
    key?: string;
    value?: string | number | boolean | object;
    description?: string;
    isActive?: boolean;
}

export interface ParameterQueryParams {
    category?: ParameterCategory;
    type?: ParameterType;
    is_active?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: "key" | "category" | "created_at" | "updated_at";
    sort_order?: "asc" | "desc";
}

// Utility type for strongly-typed parameter values by key
export interface ParameterValues {
    // Theme parameters (Phase 1 & 2)
    "theme.primary_color"?: string;
    "theme.secondary_color"?: string;
    "theme.background_color"?: string;
    "theme.card_background_color"?: string;
    "theme.border_color"?: string;
    "theme.text_color_primary"?: string;
    "theme.text_color_secondary"?: string;
    "theme.text_color"?: string; // legacy
    "theme.font_family"?: string;
    "theme.shadow_color"?: string;

    // Branding parameters (Phase 1 & 2)
    "branding.logo"?: string;
    "branding.logo_dark"?: string;
    "branding.company_name"?: string;
    "branding.company_tagline"?: string;
    "branding.tagline"?: string; // legacy
    "branding.favicon_url"?: string;

    // Layout parameters
    "layout.header_style"?: "fixed" | "static" | "sticky";
    "layout.footer_style"?: "minimal" | "full";
    "layout.sidebar_enabled"?: boolean;

    // Content parameters (Phase 1 & 2)
    "content.homepage_hero_title"?: string;
    "content.homepage_hero_subtitle"?: string;
    "content.cta_primary_text"?: string;
    "content.cta_button_text"?: string; // legacy
    "content.promotional_message"?: string;
    "content.emergency_message"?: string;
    "content.booking_success_title"?: string;
    "content.booking_success_message"?: string;
    "content.about_us_headline"?: string;
    "content.footer_tagline"?: string;
    "content.faqs"?: string;
    "content.barber_list"?: string;
    "content.cut_gallery"?: string;

    // Feature flags (Phase 1)
    "feature.booking_enabled"?: boolean;
    "feature.google_oauth_enabled"?: boolean;
    "feature.apple_oauth_enabled"?: boolean;
    "feature.phone_verification_enabled"?: boolean;
    "feature.promotional_banner_enabled"?: boolean;
    "feature.chat_support_enabled"?: boolean;
    "feature.loyalty_program_enabled"?: boolean;

    // SEO parameters
    "seo.meta_title"?: string;
    "seo.meta_description"?: string;
    "seo.meta_keywords"?: string;

    // Analytics parameters
    "analytics.google_analytics_id"?: string;
    "analytics.facebook_pixel_id"?: string;

    // Contact parameters (Phase 3.1)
    "contact.phone_number"?: string;
    "contact.email"?: string;
    "contact.address"?: string;
    "contact.business_hours"?: Record<string, string>;
    "contact.google_maps_url"?: string;
    "contact.google_review_url"?: string;
    "contact.instagram_url"?: string;
    "contact.facebook_url"?: string;
}

// Error response type
export interface ParameterErrorResponse {
    error: string;
    message: string;
    status: number;
}

export interface GetAllCategoriesResponse {
    data: [ParameterCategory]
}
