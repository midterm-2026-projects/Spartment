import { vi } from "vitest";

/*
|--------------------------------------------------------------------------
| Global Supabase Mock
|--------------------------------------------------------------------------
*/

const rpcMock = vi.fn();

const fromMock = vi.fn(() => ({
  select: vi.fn(() => ({
    eq: vi.fn(() => ({
      single: vi.fn().mockResolvedValue({
        data: {
          tenant_id: "tenant-001",
        },

        error: null,
      }),
    })),
  })),

  update: vi.fn(() => ({
    eq: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({
          data: {},

          error: null,
        }),
      })),
    })),
  })),
}));

vi.mock("../config/supabaseClient.js", () => ({
  default: {
    rpc: rpcMock,
    from: fromMock,
  },

  supabase: {
    rpc: rpcMock,
    from: fromMock,
  },
}));
