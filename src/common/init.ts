import type { MenuListType as ListType } from '@/common/data.d'

export const setListInfoSwitch = () => {
  let list: ListType[] = [
    { name: 'Market', key: '1', index: 1, url: '/market', enName: 'Market' },
    { name: 'IGOnft', key: '2', index: 2, url: '/igonft', enName: 'IGOnft' },
    { name: 'Vault', key: '3', index: 3, url: '/vault', enName: 'Vault' },
    { name: 'Governance', key: '4', index: 4, url: '/governance', enName: 'Governance' },
    { name: 'Create', key: '5', index: 5, url: '/create', enName: 'Create' },
    // { name: 'About', key: '6', index: 6, url: '/home#about', enName: 'About' },
  ]

  return { list }
}

export const ImageError =
  'data:image/png;base64,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JBAhbKT1ej2fz5fLpVccQkO0Wq3RaBQVlEAh5P9FBaOFUUQvOoQj1u/3P3z4EF8NhRDylzabzXLHKVM4mv1fr9cbDAbRP/fCCCGvEzmMDWKapqIItYtft9uN/iVJEl8NiBCSgyji09NTfI0tYzzYbrdOokJFZB++1ul0on/x+PT01MW/GvFU1Ub2rrsuLQDkvH03BAAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQAIIQBCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCABCCIAQAoAQAoAQAoAQAoAQAkAT/EeAAQB7vPOfVzTSwgAAAABJRU5ErkJggg=='

export const FILTER_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAAAAXNSR0IArs4c6QAAA8dJREFUSEutll1oW2UYx5/nfU+Sjti6hbUls87COlSKClJsTU4aetHSIUX8yvVEUBRxjs3i1QxU6oV4IYiC03uNOAdDSenHqWk46eiFsIIDcUi1LGhZbBFDc5Lz/uWpCZSySk/xgXNxPt7zez7/78vFYvEMgDgzK2MM/Z+mlCIAhpnL9Xp9hZeWlpaZ+QQAZmYcAiZrWpcsV81/CYib737TWl/iYrF4noiOE1HrxYF4AATQEA+JKMzMIWOMz8w1ZvaJyAKgBQbgFoBr7LrukVqtJg8DWSwWw9bWVgcznwLQp5Q6CeAOgJ+Z+WZHR8edSqUijtDGxoaXyWS8nZugJulZXFw8ZVnWeWYeJ6K2VmYASLQrjUbjAwArIyMjjdb/DwUrFosPAvhcKfUQgJ+YWdK0AeAeZn6AiB4DUGHmi8lkMs/MO50XCCYRlUqlE77vTzHz80T0GYCPtNabSqlGJBJR9Xq9zfO8p4loCsBtpdTZ2dnZG9ls1gSCzczMRKPR6BtE9BYRlQC8mkqlft1bhnw+H4tGo+8w80sAclrri4lE4t8CHtQKhUKnUuoyEdlE9HIymfxmv3EplUoP+75/VTrTsqynBgcHf+H5+fn7LMsK3w0YDoehtd6ORqOV/v5+z3GcnlAo9C0RHbUs68zQ0NCP+zm6vLzcXa/XrzBzr1LqhUQi4cqcfU9E9++zSGZp1RhzaXh4+MZumO/74+l0+uZ/wRqNxtdE1AvguVQqdT0QTNKotb4M4EkietG27e/2g7mu22eMuUZEfwN4VmobKI3NBjlHRBeI6AqAyVQq9edeoAiF7/vnmHmSmb+KRCKTAwMDW4EaRFp/YWHhZCQS+ZCIEgDe1lpfrdVqVZGurq4utba21tbe3v64NJIxRjPz63Nzc/nArd+KwHXdJ4wxnxLRMSJyAKwqpX6XoQZwmpmfARAjoveY+WPbtv8KPNQtWC6X093d3Y9qrSWdCVH6XWovOntEBBmA1DXfVP5gCrK3No7jHA+FQr3GmD5p8aba/0FEnUQku8kKEb1m2/btQ0e2FyqR9vT0hNfX16mzs7OutT7GzO+KpAGY3tzc/GRiYqLKjuOIYlsHVZG7fed5HsbGxqq71cR13UcAfAkgAuCVcrnsyJy92Qw70Oa5Cyr1ElDe87wfWltKLpcLx+Pxs0qpaQD57e3tCwJbJaJ7D3ssaK6T3fmLarX6/ujo6FbLkUKhEFdKTYkz4XB4Ws4g40qpuO/7ksrAZxCttWRk2xhzvVwu38pkMnIk2LFsNqvS6XSXfOP7/sY/G5rraqIAxc4AAAAASUVORK5CYII='