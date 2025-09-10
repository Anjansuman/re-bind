/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/swe_project_1.json`.
 */
export type SweProject1 = {
  "address": "8oBQJACHFg3i9A8r6CF6B2hCDY3y2NVvDZn6u97UbeDM",
  "metadata": {
    "name": "sweProject1",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "bookProperty",
      "discriminator": [
        53,
        19,
        181,
        219,
        162,
        160,
        130,
        105
      ],
      "accounts": [
        {
          "name": "property",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  101,
                  114,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "property.owner",
                "account": "property"
              },
              {
                "kind": "account",
                "path": "property.name",
                "account": "property"
              }
            ]
          }
        },
        {
          "name": "booking",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  111,
                  107,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "property"
              },
              {
                "kind": "account",
                "path": "guest"
              },
              {
                "kind": "arg",
                "path": "checkInDate"
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "booking"
              }
            ]
          }
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "guest",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "checkInDate",
          "type": "i64"
        },
        {
          "name": "checkOutDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "changeAuthority",
      "discriminator": [
        50,
        106,
        66,
        104,
        99,
        118,
        145,
        88
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "platformConfig"
          ]
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "createProperty",
      "discriminator": [
        45,
        115,
        89,
        113,
        193,
        252,
        125,
        27
      ],
      "accounts": [
        {
          "name": "property",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  101,
                  114,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "propertyMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  101,
                  114,
                  116,
                  121,
                  45,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "property"
              }
            ]
          }
        },
        {
          "name": "ownerTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "propertyMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "metadataAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "metadataProgram"
              },
              {
                "kind": "account",
                "path": "propertyMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "metadataProgram"
            }
          }
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "metadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "location",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "finalizeBooking",
      "discriminator": [
        100,
        93,
        248,
        210,
        205,
        76,
        32,
        231
      ],
      "accounts": [
        {
          "name": "property",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  101,
                  114,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "property.owner",
                "account": "property"
              },
              {
                "kind": "account",
                "path": "property.name",
                "account": "property"
              }
            ]
          }
        },
        {
          "name": "booking",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  111,
                  107,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "property"
              },
              {
                "kind": "account",
                "path": "booking.guest",
                "account": "booking"
              },
              {
                "kind": "account",
                "path": "booking.check_in_date",
                "account": "booking"
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "booking"
              }
            ]
          }
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "host",
          "writable": true,
          "signer": true
        },
        {
          "name": "platformAuthority",
          "writable": true
        },
        {
          "name": "owner",
          "relations": [
            "property"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializePlatform",
      "discriminator": [
        119,
        201,
        101,
        45,
        75,
        122,
        89,
        3
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "initializer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateProperty",
      "discriminator": [
        232,
        71,
        59,
        188,
        98,
        74,
        94,
        54
      ],
      "accounts": [
        {
          "name": "property",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  101,
                  114,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "property.name",
                "account": "property"
              }
            ]
          }
        },
        {
          "name": "propertyMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  101,
                  114,
                  116,
                  121,
                  45,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "property"
              }
            ]
          }
        },
        {
          "name": "ownerTokenAccount",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "propertyMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "metadataAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "metadataProgram"
              },
              {
                "kind": "account",
                "path": "propertyMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "metadataProgram"
            }
          }
        },
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "property"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "metadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "newName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newSymbol",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newUri",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newPrice",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "newLocation",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newDescription",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newAvailability",
          "type": {
            "option": "bool"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "booking",
      "discriminator": [
        147,
        50,
        61,
        138,
        208,
        21,
        254,
        156
      ]
    },
    {
      "name": "platformConfig",
      "discriminator": [
        160,
        78,
        128,
        0,
        248,
        83,
        230,
        160
      ]
    },
    {
      "name": "property",
      "discriminator": [
        195,
        247,
        69,
        181,
        195,
        47,
        152,
        19
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorizedOwner",
      "msg": "Only the property owner can perform this action"
    },
    {
      "code": 6001,
      "name": "mustOwnPropertyNft",
      "msg": "Must own the property NFT to perform this action"
    },
    {
      "code": 6002,
      "name": "nameTooLong",
      "msg": "Property name must be 60 characters or less"
    },
    {
      "code": 6003,
      "name": "locationTooLong",
      "msg": "Location must be 124 characters or less"
    },
    {
      "code": 6004,
      "name": "descriptionTooLong",
      "msg": "Description must be 252 characters or less"
    },
    {
      "code": 6005,
      "name": "symbolTooLong",
      "msg": "Property symbol must be 10 characters or less"
    },
    {
      "code": 6006,
      "name": "uriTooLong",
      "msg": "Property URI must be 200 characters or less"
    },
    {
      "code": 6007,
      "name": "propertyNotAvailable",
      "msg": "Property is not available for booking"
    },
    {
      "code": 6008,
      "name": "propertyCurrentlyBooked",
      "msg": "Property is currently booked and cannot be modified"
    },
    {
      "code": 6009,
      "name": "propertyMustBeUnavailable",
      "msg": "Property must be set to unavailable before removal"
    },
    {
      "code": 6010,
      "name": "propertyHasActiveBookings",
      "msg": "Property has active bookings and cannot be removed"
    },
    {
      "code": 6011,
      "name": "cannotBookOwnProperty",
      "msg": "Cannot book your own property"
    },
    {
      "code": 6012,
      "name": "insufficientBookingAmount",
      "msg": "Booking amount is insufficient"
    },
    {
      "code": 6013,
      "name": "invalidBookingDuration",
      "msg": "Booking duration must be at least 1 night"
    },
    {
      "code": 6014,
      "name": "invalidCheckInDate",
      "msg": "Check-in date must be in the future"
    },
    {
      "code": 6015,
      "name": "invalidCheckOutDate",
      "msg": "Check-out date must be after check-in date"
    },
    {
      "code": 6016,
      "name": "invalidBookingStatus",
      "msg": "Invalid booking status for this operation"
    },
    {
      "code": 6017,
      "name": "cannotCancelBooking",
      "msg": "Cannot cancel booking at this time"
    },
    {
      "code": 6018,
      "name": "unauthorizedBookingAction",
      "msg": "Unauthorized to perform booking action"
    },
    {
      "code": 6019,
      "name": "insufficientEscrowFunds",
      "msg": "Insufficient funds in escrow account"
    },
    {
      "code": 6020,
      "name": "unauthorizedPlatformAction",
      "msg": "Only platform authority can perform this action"
    },
    {
      "code": 6021,
      "name": "invalidPlatformFee",
      "msg": "Platform fee cannot exceed 10%"
    },
    {
      "code": 6022,
      "name": "invalidAccount",
      "msg": "Invalid account provided"
    },
    {
      "code": 6023,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow occurred"
    },
    {
      "code": 6024,
      "name": "invalidTimestamp",
      "msg": "Invalid timestamp"
    }
  ],
  "types": [
    {
      "name": "booking",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bookingId",
            "type": "u64"
          },
          {
            "name": "property",
            "type": "pubkey"
          },
          {
            "name": "guest",
            "type": "pubkey"
          },
          {
            "name": "host",
            "type": "pubkey"
          },
          {
            "name": "checkInDate",
            "type": "i64"
          },
          {
            "name": "checkOutDate",
            "type": "i64"
          },
          {
            "name": "totalTime",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "platformFee",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "bookingStatus"
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "confirmedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "cancelledAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "bookingStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "confirmed"
          },
          {
            "name": "active"
          },
          {
            "name": "completed"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    },
    {
      "name": "platformConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "platformFee",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "property",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "location",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "isAvailable",
            "type": "bool"
          },
          {
            "name": "totalBookings",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
