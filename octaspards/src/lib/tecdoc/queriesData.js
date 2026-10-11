// Generated TecDoc 2Q 2023 Query Catalog in English
export const TECDOC_QUERIES = [
  {
    "id": "q_1",
    "filename": "get_all_criteria_for_article.sql",
    "titleEn": "Article Specifications & Technical Criteria",
    "category": "articles",
    "icon": "sliders",
    "description": "Selects all technical criteria and specifications (dimensions, voltage, thread, material) for a specific part article number.",
    "tables": [
      "ARTICLES",
      "ARTICLE_CRITERIA",
      "CRITERIA",
      "KEY_VALUES"
    ],
    "defaultParams": {
      "ART_ID": "1878343",
      "LNGID": "4"
    },
    "sql": " SET @ART_ID = 29; /* BOSCH 0 001 106 016 */\t\r\n  SET @LNGID = 4; /* BOSCH 0 001 106 016 */\t\r\n\t\tSET SESSION group_concat_max_len = 10000000;\n\n   SELECT \n          *\n   FROM\n   (SELECT DISTINCT\n          get_text(CRITERIA.CRI_DES_ID, @LNGID ) AS CRITERIA_NAME, \n          GROUP_CONCAT( DISTINCT              \n                 CASE\n                     WHEN CRITERIA.CRI_TYPE = 3 \n\t\t        THEN \n                            get_text_kt(ARTICLE_CRITERIA.ACR_KV_KT_ID, ARTICLE_CRITERIA.ACR_VALUE, @LNGID) \n                        ELSE\n                             ARTICLE_CRITERIA.ACR_VALUE\n\t\t        END\n          SEPARATOR '; ') AS CRITERIA_VALUE\n\t FROM\n\t\t  ARTICLE_CRITERIA\n          INNER JOIN CRITERIA ON CRITERIA.CRI_ID = ARTICLE_CRITERIA.ACR_CRI_ID\n\tWHERE\n          ARTICLE_CRITERIA.ACR_ART_ID = @ART_ID\n    GROUP BY \n          CRITERIA.CRI_ID   \n   UNION\n   \n   SELECT \n\t       get_text(L_CRITERIA.CRI_DES_ID, @LNGID ) AS CRITERIA_NAME,\n               GROUP_CONCAT( DISTINCT              \n               CASE\n                    WHEN L_CRITERIA.CRI_TYPE = 3 \n\t\t      THEN \n                        get_text_kt(LA_CRITERIA.LAC_KV_KT_ID, LA_CRITERIA.LAC_VALUE, @LNGID) \n                      ELSE\n                        LA_CRITERIA.LAC_VALUE\n\t\t    END\n           SEPARATOR '; ') AS CRITERIA_VALUE\n\t FROM\n          LINK_ART\n          INNER JOIN LA_CRITERIA ON LA_CRITERIA.LAC_LA_ID = LINK_ART.LA_ID\n          INNER JOIN CRITERIA AS L_CRITERIA ON L_CRITERIA.CRI_ID = LA_CRITERIA.LAC_CRI_ID\n    WHERE\n\t\t  LINK_ART.LA_ART_ID = @ART_ID\n   GROUP BY \n          L_CRITERIA.CRI_ID) AS ALL_CRITERIA\nGROUP BY CRITERIA_NAME"
  },
  {
    "id": "q_2",
    "filename": "get_all_criteria_for_passenger_car.sql",
    "titleEn": "Passenger Car Specifications & Technical Criteria",
    "category": "vehicles",
    "icon": "car",
    "description": "Retrieves complete vehicle technical criteria (wheelbase, drive type, cylinder capacity, valves, etc.) for a passenger car.",
    "tables": [
      "PASSENGER_CARS",
      "PC_COUNTRY_SPECIFICS",
      "CRITERIA"
    ],
    "defaultParams": {
      "PC_ID": "9877",
      "LNGID": "4"
    },
    "sql": "SET @PC_ID = 19964;\r\nSET @LNGID = 4;\n    SET SESSION group_concat_max_len = 10000000;\n\n    SELECT\n          distinct *\n    FROM \n    (\n        SELECT distinct\n               get_text(CRITERIA.CRI_DES_ID, @LNGID ) AS CRITERIA_NAME, \n               GROUP_CONCAT( distinct              \n                 CASE\n                     WHEN CRITERIA.CRI_TYPE = 3 \n\t\t        THEN \n                            get_text_kt(ARTICLE_CRITERIA.ACR_KV_KT_ID, ARTICLE_CRITERIA.ACR_VALUE, @LNGID) \n                        ELSE\n                             ARTICLE_CRITERIA.ACR_VALUE\n\t\t        END\n                 SEPARATOR '; ') AS CRITERIA_VALUE\n\n        FROM \n               LINK_LA_TYP \n               INNER JOIN LINK_ART ON LINK_ART.LA_ID = LINK_LA_TYP.LAT_LA_ID\n               INNER JOIN ARTICLE_CRITERIA ON ARTICLE_CRITERIA.ACR_ART_ID = LINK_ART.LA_ART_ID\n               INNER JOIN CRITERIA ON CRITERIA.CRI_ID = ARTICLE_CRITERIA.ACR_CRI_ID\n        WHERE\n               LINK_LA_TYP.LAT_TYP_ID = @PC_ID\n                    AND LINK_LA_TYP.LAT_TYPE = 2 -- passenger cars\n        GROUP BY \n               CRITERIA.CRI_ID\n   UNION  \n       SELECT distinct\n               get_text(L_CRITERIA.CRI_DES_ID, @LNGID ) AS CRITERIA_NAME,\n               GROUP_CONCAT( distinct              \n               CASE\n                    WHEN L_CRITERIA.CRI_TYPE = 3 \n\t\t      THEN \n                        get_text_kt(LA_CRITERIA.LAC_KV_KT_ID, LA_CRITERIA.LAC_VALUE, @LNGID) \n                      ELSE\n                        LA_CRITERIA.LAC_VALUE\n\t\t    END\n               SEPARATOR '; ') AS CRITERIA_VALUE\n\n       FROM \n               LINK_LA_TYP \n               INNER JOIN LA_CRITERIA ON LA_CRITERIA.LAC_LA_ID = LINK_LA_TYP.LAT_LA_ID\n               INNER JOIN CRITERIA AS L_CRITERIA ON L_CRITERIA.CRI_ID = LA_CRITERIA.LAC_CRI_ID\n       WHERE\n               LINK_LA_TYP.LAT_TYP_ID = @PC_ID\n               AND LINK_LA_TYP.LAT_TYPE = 2 /* passenger cars */\n       GROUP BY \n               L_CRITERIA.CRI_ID) all_criteria\nGROUP BY CRITERIA_NAME"
  },
  {
    "id": "q_3",
    "filename": "get_article_information.sql",
    "titleEn": "Article Detailed Information & Packaging",
    "category": "articles",
    "icon": "info",
    "description": "Retrieves brand, article number, product description, trade numbers, status, and packing units.",
    "tables": [
      "ARTICLES",
      "SUPPLIERS",
      "TEXT_DESIGNATIONS",
      "PRODUCTS"
    ],
    "defaultParams": {
      "ART_NUM": "0 001 108 466",
      "SUP_ID": "30",
      "ART_ID": "1878343",
      "LNGID": "4"
    },
    "sql": "SET @ART_NUM = \"0 001 108 466\";\r\n     SET @SUP_ID = 30; /* BOSCH */ \r\n\r\n     SELECT\r\n          ARTICLES.ART_ID,\r\n          ARTICLES.ART_ARTICLE_NR,\r\n          ARTICLES.ART_SUP_BRAND,\r\n          ART_COUNTRY_SPECIFICS.ACS_PACK_UNIT,\r\n          ART_COUNTRY_SPECIFICS.ACS_QUANTITY_PER_UNIT,\r\n          ART_COUNTRY_SPECIFICS.ACS_STATUS_DATE,\r\n          get_text(KEY_VALUES.KV_DES_ID, @LNGID) AS ART_STATUS_TEXT,\r\n-- ---------------------------------------------------------------        \r\n          CONCAT_WS(' ', get_text(ARTICLES.ART_COMPLETE_DES_ID, @LNGID), get_text(ARTICLES.ART_DES_ID, @LNGID) ) AS ART_PRODUCT_NAME,\r\n-- ---------------------------------------------------------------                  \r\n          (SELECT \r\n                CONCAT_WS(0x0a0d2d, get_text_kt(72, ARTICLE_INFO.AIN_KV_TYPE, @LNGID), \r\n                                    GROUP_CONCAT(  IFNULL( TEXT_MODULE_TEXTS.TMT_TEXT, TEXT_MODULE_TEXTS_UNI.TMT_TEXT )  SEPARATOR 0x0a0d2d ) )\r\n           FROM\r\n                 ARTICLE_INFO\r\n                 LEFT OUTER JOIN TEXT_MODULE_TEXTS ON TEXT_MODULE_TEXTS.TMT_ID = ARTICLE_INFO.AIN_TMT_ID\r\n                      AND  TEXT_MODULE_TEXTS.TMT_LNG_ID = @LNGID\r\n                      \r\n                 LEFT OUTER JOIN TEXT_MODULE_TEXTS AS TEXT_MODULE_TEXTS_UNI ON TEXT_MODULE_TEXTS_UNI.TMT_ID = ARTICLE_INFO.AIN_TMT_ID\r\n                      AND  TEXT_MODULE_TEXTS_UNI.TMT_LNG_ID = 255\r\n            WHERE\r\n                 ARTICLE_INFO.AIN_ART_ID = ARTICLES.ART_ID) AS ART_INFO,\r\n-- ---------------------------------------------------------------                 \r\n           (SELECT\r\n                 GROUP_CONCAT( SUPERSEDED_ARTICLES.SUA_NUMBER )\r\n            FROM\r\n                 SUPERSEDED_ARTICLES\r\n\t\t\t\t INNER JOIN COUNTRY_RESTRICTIONS ON COUNTRY_RESTRICTIONS.CNTR_ID = SUPERSEDED_ARTICLES.SUA_CTM\r\n\t\t\t\t\t\tAND COUNTRY_RESTRICTIONS.CNTR_COU_ID = @COUNTRY_FILTER\r\n            WHERE\r\n                 SUPERSEDED_ARTICLES.SUA_ART_ID = ARTICLES.ART_ID) AS 'SUPERSEDED BY',\r\n-- ---------------------------------------------------------------                 \r\n           (SELECT\r\n                  GROUP_CONCAT( ARTICLES.ART_ARTICLE_NR )\r\n            FROM\r\n                  SUPERSEDED_ARTICLES\r\n                  INNER JOIN ARTICLES ON ARTICLES.ART_ID = SUPERSEDED_ARTICLES.SUA_ART_ID\r\n\t\t\t\t  INNER JOIN COUNTRY_RESTRICTIONS ON COUNTRY_RESTRICTIONS.CNTR_ID = SUPERSEDED_ARTICLES.SUA_CTM\r\n\t\t\t\t\t\tAND COUNTRY_RESTRICTIONS.CNTR_COU_ID = @COUNTRY_FILTER\r\n           WHERE\r\n                  SUPERSEDED_ARTICLES.SUA_NEW_ART_ID = ARTICLES.ART_ID) AS 'SUPERSEDED',\r\n-- ---------------------------------------------------------------                \r\n          (SELECT\r\n                 GROUP_CONCAT( \r\n                              CONCAT_WS(': ', get_text(CRITERIA.CRI_DES_ID, @LNGID), \r\n                                (CASE\r\n                                     WHEN CRITERIA.CRI_TYPE = 3 \r\n\t\t\t\t\t\t\t\t\t\t THEN \r\n                                           get_text_kt(ARTICLE_CRITERIA.ACR_KV_KT_ID, ARTICLE_CRITERIA.ACR_VALUE, @LNGID) \r\n                                     ELSE\r\n                                        ARTICLE_CRITERIA.ACR_VALUE\r\n                                END) )\r\n                 SEPARATOR '; ')\r\n           FROM\r\n                 ARTICLE_CRITERIA\r\n                 INNER JOIN CRITERIA ON ARTICLE_CRITERIA.ACR_CRI_ID = CRITERIA.CRI_ID\r\n           WHERE\r\n                 ARTICLE_CRITERIA.ACR_ART_ID = ARTICLES.ART_ID LIMIT 4 ) AS ARTICLE_CRITERIA,\r\n-- --------------------------------------------------------------- \r\n\t\t   GROUP_CONCAT(\r\n                         IF( ART_LOOKUP.ARL_KIND = 3,\r\n\t\t\t\t\t\t\t CONCAT_WS( ': ', ART_LOOKUP.ARL_BRA_BRAND, ART_LOOKUP.ARL_DISPLAY_NR ),\r\n                             NULL )\r\n\t\t   SEPARATOR 0x0a ) AS OEM_NUMBERS,\r\n-- --------------------------------------------------------------- \r\n\t\t   GROUP_CONCAT( \r\n\t\t\t\t\t\t IF( ART_LOOKUP.ARL_KIND = 5,\r\n                             ART_LOOKUP.ARL_DISPLAY_NR,\r\n                             NULL )\r\n\t\t   SEPARATOR 0x0a ) AS EAN_NUMBERS\r\n-- ---------------------------------------------------------------       \r\n    FROM\r\n        ARTICLES\r\n        INNER JOIN ART_COUNTRY_SPECIFICS ON ART_COUNTRY_SPECIFICS.ACS_ART_ID = ARTICLES.ART_ID\r\n             AND (ART_COUNTRY_SPECIFICS.ACS_COU_ID = @COUNTRY_FILTER OR ART_COUNTRY_SPECIFICS.ACS_COU_ID = 255)\r\n              \r\n        LEFT OUTER JOIN KEY_VALUES ON KEY_VALUES.KV_KT_ID = 73\r\n             AND KEY_VALUES.KV_KV = ART_COUNTRY_SPECIFICS.ACS_STATUS_KV_KV\r\n  \r\n        INNER JOIN SUPPLIERS ON ARTICLES.ART_SUP_ID = SUP_ID\r\n        \r\n        INNER JOIN ART_LOOKUP ON ART_LOOKUP.ARL_ART_ID = ARTICLES.ART_ID\r\n \r\n    WHERE\r\n        ARTICLES.ART_ARTICLE_NR = @ART_NUM \r\n        AND ARTICLES.ART_SUP_ID = @SUP_ID"
  },
  {
    "id": "q_4",
    "filename": "get_article_criteria_for_car.sql",
    "titleEn": "Article Criteria Specific to Selected Vehicle",
    "category": "articles",
    "icon": "check-square",
    "description": "Retrieves criteria for an article specifically applicable to a given vehicle configuration.",
    "tables": [
      "LINK_LA_PR",
      "ARTICLE_CRITERIA",
      "PASSENGER_CARS"
    ],
    "defaultParams": {
      "PC_ID": "9877",
      "PT_ID": "1",
      "SUP_ID": "434",
      "LINK_TYPE": "2",
      "ART_ID": "1878343",
      "COU_ID": "0",
      "LNGID": "4"
    },
    "sql": " SET @PC_ID = 108275; \r\n    SET @PT_ID = 1; /* Satelis 125 (J2) */\r\n    SET @SUP_ID = 434; /* DETA */\r\n    SET @LINK_TYPE= 2; /* passenger cars */\r\n \r\n    SELECT DISTINCT\r\n           ARTICLES.ART_ID,\r\n           LINK_PT_CRI.LPC_CRI_ID,\r\n           get_text(CRITERIA.CRI_DES_ID, @LNGID),\r\n           ARTICLE_CRITERIA.ACR_VALUE,\r\n           LINK_PT_CRI.LPC_SUGGESTION\r\n           \r\n    FROM \r\n           LINK_PT_CRI\r\n           \r\n           INNER JOIN LINK_LA_TYP ON LINK_LA_TYP.LAT_TYP_ID = @PC_ID \r\n                  AND LINK_LA_TYP.LAT_TYPE = @LINK_TYPE \r\n                  AND LINK_LA_TYP.LAT_PT_ID = @PT_ID\r\n                  AND LINK_LA_TYP.LAT_SUP_ID = @SUP_ID\r\n                  \r\n           INNER JOIN LINK_ART ON LINK_ART.LA_ID = LINK_LA_TYP.LAT_LA_ID\r\n            \r\n           INNER JOIN ARTICLES ON ARTICLES.ART_ID = LINK_ART.LA_ART_ID \r\n           \r\n           INNER JOIN ARTICLE_CRITERIA ON ARTICLE_CRITERIA.ACR_ART_ID = ARTICLES.ART_ID\r\n                  AND ARTICLE_CRITERIA.ACR_CRI_ID = LINK_PT_CRI.LPC_CRI_ID\r\n                  \r\n           INNER JOIN CRITERIA ON ARTICLE_CRITERIA.ACR_CRI_ID = CRITERIA.CRI_ID\r\n           \r\n    WHERE\r\n           LINK_PT_CRI.LPC_PT_ID = @PT_ID"
  },
  {
    "id": "q_5",
    "filename": "get_commercial_vehicle_detailed_info.sql",
    "titleEn": "Commercial Vehicle Detailed Specifications",
    "category": "vehicles",
    "icon": "truck",
    "description": "Detailed technical data for commercial vehicles and trucks (tonnage, axle configuration, brake systems).",
    "tables": [
      "COMMERCIAL_VEHICLES",
      "MANUFACTURERS",
      "MODELS_SERIES"
    ],
    "defaultParams": {
      "CV_ID": "3410"
    },
    "sql": "SET @CV_ID=17582; -- DAF CF FA 290\r\n\r\n    SELECT DISTINCT\r\n           CV_ID AS TECDOC_TYPE_NO,\r\n           CONCAT_WS(' ', MFA_BRAND,  \r\n                   get_text(IFNULL(`MS_COUNTRY_SPECIFICS`.`MSCS_NAME_DES`,`MODELS_SERIES`.`MS_NAME_DES`), @LNGID),\r\n                   get_text(COMMERCIAL_VEHICLES.CV_MODEL_DES, @LNGID) ) AS TYPEL,        \r\n           CV_COUNTRY_SPECIFICS.CCS_CONSTRUCTION_INTERVAL_START,\r\n           CV_COUNTRY_SPECIFICS.CCS_CONSTRUCTION_INTERVAL_END,\r\n           CV_COUNTRY_SPECIFICS.CCS_POWER_PS_START,\r\n           CV_COUNTRY_SPECIFICS.CCS_POWER_PS_UPTO,\r\n           CV_COUNTRY_SPECIFICS.CCS_POWER_KW_START,\r\n           CV_COUNTRY_SPECIFICS.CCS_POWER_KW_UPTO,\r\n           CV_COUNTRY_SPECIFICS.CCS_CAPACITY_TECH,\r\n           CV_COUNTRY_SPECIFICS.CCS_TONNAGE,\r\n        \r\n           get_text(CV_COUNTRY_SPECIFICS.CCS_PLATFORM_TYPE , @LNGID) AS CV_PLATFORM_TYPE,\r\n           get_text(CV_COUNTRY_SPECIFICS.CCS_ENGINE_TYPE , @LNGID) AS CV_ENGINE_TYPE,\r\n           get_text(CV_COUNTRY_SPECIFICS.CCS_AXLE_CONFIGURATION , @LNGID) AS CV_AXLE_CONFIGURATION,\r\n-- ---------------------------------------------------------------    \r\n           (SELECT\r\n                  GROUP_CONCAT( CONCAT(  WHEELBASES.AXLE_GROUP, '/',  WHEELBASES.WHELL_BASE, ' mm' ) )\r\n            FROM\r\n                  WHEELBASES\r\n            WHERE\r\n                  WHEELBASES.CV_ID = COMMERCIAL_VEHICLES.CV_ID) as CV_WHEELBASES,\r\n-- ---------------------------------------------------------------\r\n            (SELECT\r\n                  GROUP_CONCAT( CONCAT( get_text(CV_SUSPENSIONS.AXLE_POS_DES, @LNGID), '/',  get_text(CV_SUSPENSIONS.SUSPENSION_DES, @LNGID) ) )\r\n             FROM\r\n                  CV_SUSPENSIONS\r\n             WHERE\r\n                  CV_SUSPENSIONS.CV_ID = COMMERCIAL_VEHICLES.CV_ID) as CV_SUSPENSIONS,\r\n-- ---------------------------------------------------------------\r\n            (SELECT\r\n                  GROUP_CONCAT( get_text(DRIVERS_CABS.DC_MODEL_DES, @LNGID) )\r\n             FROM\r\n                  DRIVERS_CABS\r\n                  LEFT OUTER JOIN DRIVERS_CABS_DES ON DRIVERS_CABS_DES.DC_ID = DRIVERS_CABS.DC_ID \r\n             WHERE\r\n                  DRIVERS_CABS_DES.CV_ID = COMMERCIAL_VEHICLES.CV_ID) as DRIVERS_CABS,\r\n-- ---------------------------------------------------------------\r\n            (SELECT\r\n                  GROUP_CONCAT( AXLES.AXL_DESCRIPTION )\r\n             FROM\r\n                  AXLES\r\n                  LEFT OUTER JOIN CV_AXLES_DES ON CV_AXLES_DES.AXL_ID = AXLES.AXL_ID\r\n             WHERE\r\n                  CV_AXLES_DES.CV_ID = COMMERCIAL_VEHICLES.CV_ID) as AXLES,\r\n-- ---------------------------------------------------------------\r\n            (SELECT\r\n                  GROUP_CONCAT( CV_MANUFACTURER_IDS.CV_MANUF_NUM )\r\n             FROM\r\n                  CV_MANUFACTURER_IDS\r\n                  LEFT OUTER JOIN CV_MANUF_IDS_DES ON CV_MANUF_IDS_DES.CV_MANUF_ID = CV_MANUFACTURER_IDS.CV_MANUF_ID\r\n             WHERE\r\n                  CV_MANUF_IDS_DES.CV_ID = COMMERCIAL_VEHICLES.CV_ID) as CV_MANUF_CODES,\r\n-- ---------------------------------------------------------------\r\n            (SELECT\r\n                  GROUP_CONCAT(ENGINES.ENG_CODE)\r\n             FROM\r\n                  ENGINES\r\n                  JOIN ENG_DESIGNATIONS ON (ENGINES.ENG_ID=ENG_DESIGNATIONS.ENG_ID)\r\n             WHERE\r\n                  ENG_DESIGNATIONS.CV_ID = COMMERCIAL_VEHICLES.CV_ID) as CV_ENG_CODES\r\n    FROM\r\n        COMMERCIAL_VEHICLES\r\n        \r\n        INNER JOIN CV_COUNTRY_SPECIFICS ON CV_COUNTRY_SPECIFICS.CCS_CV_ID = COMMERCIAL_VEHICLES.CV_ID\r\n             AND (CV_COUNTRY_SPECIFICS.CCS_COU_ID = @COUNTRY_FILTER OR CV_COUNTRY_SPECIFICS.CCS_COU_ID = 0)\r\n             \r\n        INNER JOIN MODELS_SERIES ON COMMERCIAL_VEHICLES.CV_MS_ID = MODELS_SERIES.MS_ID\r\n        \r\n        LEFT OUTER JOIN `MS_COUNTRY_SPECIFICS`\r\n                     ON `MS_COUNTRY_SPECIFICS`.`MSCS_ID` = `MODELS_SERIES`.`MS_ID`\r\n                    AND `MS_COUNTRY_SPECIFICS`.`MSCS_COU_ID` = @COUNTRY_FILTER \r\n        \r\n        INNER JOIN MANUFACTURERS ON COMMERCIAL_VEHICLES.CV_MFA_ID = MANUFACTURERS.MFA_ID\r\n       \r\n    WHERE\r\n        COMMERCIAL_VEHICLES.CV_ID = @CV_ID"
  },
  {
    "id": "q_6",
    "filename": "get_passenger_car_detailed_info.sql",
    "titleEn": "Passenger Car Detailed Specifications & Engine",
    "category": "vehicles",
    "icon": "activity",
    "description": "Comprehensive vehicle info including horsepower, kW, construction date interval, engine code, body type.",
    "tables": [
      "PASSENGER_CARS",
      "PC_COUNTRY_SPECIFICS",
      "MANUFACTURERS",
      "MODELS_SERIES"
    ],
    "defaultParams": {
      "PCID": "1014",
      "PC_ID": "9877"
    },
    "sql": " SET @PCID = 1014; /* FORD TRANSIT Bus (V_ _) 2.0 (VAS, VIL, VLS, VUL, VZS) */ \r\n\r\n   SELECT\r\n         CONCAT( MFA_BRAND, ' ',  \r\n                 get_text(IFNULL(`MS_COUNTRY_SPECIFICS`.`MSCS_NAME_DES`,`MODELS_SERIES`.`MS_NAME_DES`), @LNGID), ' ', \r\n                 get_text(PASSENGER_CARS.PC_MODEL_DES, @LNGID) ) AS TYPEL,\r\n         PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_START,\r\n         PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_END,\r\n         PC_COUNTRY_SPECIFICS.PCS_POWER_KW,\r\n         PC_COUNTRY_SPECIFICS.PCS_POWER_PS,\r\n         PC_COUNTRY_SPECIFICS.PCS_CAPACITY_TAX,\r\n         PC_COUNTRY_SPECIFICS.PCS_CAPACITY_LT,\r\n         PC_COUNTRY_SPECIFICS.PCS_CAPACITY_TECH,\r\n         PC_COUNTRY_SPECIFICS.PCS_ABS,\r\n         PC_COUNTRY_SPECIFICS.PCS_ASR,\r\n         PC_COUNTRY_SPECIFICS.PCS_NUMBER_OF_CYLINDERS,\r\n         \r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_BODY_TYPE, @LNGID) AS PC_BODY_TYPE,\r\n\t\t get_text(PC_COUNTRY_SPECIFICS.PCS_ENGINE_TYPE, @LNGID) AS PC_ENGINE_TYPE,\r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_GEAR_TYPE, @LNGID) AS PC_GEAR_TYPE,\r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_DRIVE_TYPE, @LNGID) AS PC_DRIVE_TYPE,\r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_BRAKE_SYSTEM, @LNGID) AS PC_BRAKE_SYSTEM,\r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_BRAKE_TYPE, @LNGID) AS PC_BRAKE_TYPE,\r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_FUEL_TYPE, @LNGID) AS PC_FUEL_TYPE,\r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_CATALYSATOR_TYPE, @LNGID) AS PC_CATALYSATOR_TYPE,\r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_FUEL_MIXTURE, @LNGID)  AS PC_FUEL_MIXTURE,\r\n         \r\n         (SELECT\r\n                GROUP_CONCAT(ENGINES.ENG_CODE)\r\n          FROM\r\n                ENGINES\r\n                JOIN ENG_DESIGNATIONS ON (ENGINES.ENG_ID=ENG_DESIGNATIONS.ENG_ID)\r\n          WHERE\r\n                ENG_DESIGNATIONS.PC_ID = PASSENGER_CARS.PC_ID) AS PC_ENG_CODES\r\n         \r\n   FROM \r\n         PASSENGER_CARS\r\n         \r\n         INNER JOIN PC_COUNTRY_SPECIFICS ON PC_COUNTRY_SPECIFICS.PCS_PC_ID = PASSENGER_CARS.PC_ID\r\n              AND (PC_COUNTRY_SPECIFICS.PCS_COU_ID = @COUNTRY_FILTER OR PC_COUNTRY_SPECIFICS.PCS_COU_ID = 0)\r\n         \r\n         INNER JOIN MODELS_SERIES ON MODELS_SERIES.MS_ID = PASSENGER_CARS.PC_MS_ID\r\n         \r\n         INNER JOIN MANUFACTURERS ON MANUFACTURERS.MFA_ID = PASSENGER_CARS.PC_MFA_ID\r\n         \r\n         LEFT OUTER JOIN `MS_COUNTRY_SPECIFICS`\r\n                      ON `MS_COUNTRY_SPECIFICS`.`MSCS_ID` = `MODELS_SERIES`.`MS_ID`\r\n                     AND `MS_COUNTRY_SPECIFICS`.`MSCS_COU_ID` = @COUNTRY_FILTER \r\n\r\n   WHERE \r\n         PASSENGER_CARS.PC_ID = @PCID"
  },
  {
    "id": "q_7",
    "filename": "get_suppliers_and_product_groups_for_car.sql",
    "titleEn": "Suppliers & Product Groups for Vehicle",
    "category": "trees",
    "icon": "package",
    "description": "Retrieves all available parts suppliers (brands) and product groups that produce parts for a selected car.",
    "tables": [
      "LINK_GA_STR",
      "LINK_ART_GA",
      "SUPPLIERS",
      "SEARCH_TREE"
    ],
    "defaultParams": {
      "STR_ID": "100470",
      "PC_ID": "9877",
      "STR_TYPE": "1",
      "LINK_TYPE": "2",
      "COU_ID": "0",
      "MFA_ID": "16",
      "LNGID": "4"
    },
    "sql": " SET @STR_ID = 100470; /* /Engine/Lubrication/Oil Filter */\r\n    SET @PC_ID = 9877; \r\n    SET @STR_TYPE=1;  /* passenger cars */\r\n    SET @LINK_TYPE= 2;  /* passenger cars */\r\n\r\n \r\n    SELECT DISTINCT\r\n           SUPPLIERS.SUP_BRAND,\r\n           SUPPLIERS.SUP_ID,\r\n           get_text(PRODUCTS.PT_DES_ID, @LNGID) AS \"PRODUCT GROUP\",\r\n           PRODUCTS.PT_ID\r\n    FROM \r\n           SEARCH_TREE\r\n           INNER JOIN LINK_PT_STR ON LINK_PT_STR.STR_ID = @STR_ID \r\n                 AND LINK_PT_STR.STR_TYPE = @STR_TYPE \r\n\t\t\r\n           INNER JOIN LINK_LA_TYP ON LINK_LA_TYP.LAT_TYP_ID = @PC_ID \r\n                 AND LINK_LA_TYP.LAT_TYPE = @LINK_TYPE \r\n                 AND LINK_LA_TYP.LAT_PT_ID = LINK_PT_STR.PT_ID\r\n     \r\n           INNER JOIN LINK_ART ON LINK_ART.LA_ID = LINK_LA_TYP.LAT_LA_ID\r\n            \r\n           INNER JOIN ARTICLES ON ARTICLES.ART_ID = LINK_ART.LA_ART_ID\r\n\r\n           INNER JOIN SUPPLIERS ON SUPPLIERS.SUP_ID = LINK_LA_TYP.LAT_SUP_ID\r\n           INNER JOIN PRODUCTS ON PRODUCTS.PT_ID = LINK_LA_TYP.LAT_PT_ID\r\n    WHERE\r\n           SEARCH_TREE.STR_ID = @STR_ID \r\n            AND SEARCH_TREE.STR_TYPE = @STR_TYPE  \r\n    ORDER BY SUP_BRAND"
  },
  {
    "id": "q_8",
    "filename": "get_article_linkage_to_passenger_cars.sql",
    "titleEn": "Article Fitment & Vehicle Compatibility",
    "category": "articles",
    "icon": "link",
    "description": "Finds all passenger car models that the given spare part article fits.",
    "tables": [
      "ARTICLES",
      "LINK_ART_GA",
      "LINK_LA_PR",
      "PASSENGER_CARS",
      "MODELS_SERIES"
    ],
    "defaultParams": {
      "ART_ID": "1878343"
    },
    "sql": " SET @ART_ID = 96; /* BOSCH 0 001 107 066 */\t\r\n\r\n    SELECT DISTINCT\r\n        (SELECT\r\n                 GROUP_CONCAT(\r\n                              CONCAT_WS(': ', get_text(CRITERIA.CRI_DES_ID, @LNGID),\r\n                                (CASE\r\n                                     WHEN CRITERIA.CRI_TYPE = 3\r\n                                         THEN\r\n                                           get_text_kt(LA_CRITERIA.LAC_KV_KT_ID, LA_CRITERIA.LAC_VALUE, @LNGID)\r\n                                     ELSE\r\n                                        LA_CRITERIA.LAC_VALUE\r\n                                END) )\r\n                 SEPARATOR '; ')\r\n           FROM\r\n                 LA_CRITERIA\r\n                 INNER JOIN CRITERIA ON LA_CRITERIA.LAC_CRI_ID = CRITERIA.CRI_ID\r\n           WHERE\r\n                 LA_CRITERIA.LAC_LA_ID = LINK_LA_TYP.LAT_LA_ID AND LA_CRITERIA.LAC_DISPLAY = 1) AS 'TERM_OF_USE',\r\n\r\n           PASSENGER_CARS.PC_ID,\r\n           MODELS_SERIES.MS_ID,\r\n           CONCAT_WS(' ', MFA_BRAND,  \r\n                 get_text(IFNULL(`MS_COUNTRY_SPECIFICS`.`MSCS_NAME_DES`,`MODELS_SERIES`.`MS_NAME_DES`), @LNGID),\r\n                 get_text(PASSENGER_CARS.PC_MODEL_DES, @LNGID) ) AS TYPEL,\r\n           PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_START,\r\n           PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_END,\r\n           PC_COUNTRY_SPECIFICS.PCS_POWER_KW,\r\n           PC_COUNTRY_SPECIFICS.PCS_POWER_PS,\r\n           PC_COUNTRY_SPECIFICS.PCS_CAPACITY_TECH,\r\n           get_text(PC_COUNTRY_SPECIFICS.PCS_BODY_TYPE, @LNGID) AS PC_BODY_TYPE,\r\n\r\n           (SELECT\r\n                  GROUP_CONCAT(ENGINES.ENG_CODE)\r\n            FROM\r\n                  ENGINES\r\n                  JOIN ENG_DESIGNATIONS ON (ENGINES.ENG_ID=ENG_DESIGNATIONS.ENG_ID)\r\n            WHERE\r\n                  ENG_DESIGNATIONS.PC_ID = PASSENGER_CARS.PC_ID) AS PC_ENG_CODES\r\n    FROM\r\n           LINK_ART \r\n         \r\n           INNER JOIN LINK_LA_TYP ON LINK_LA_TYP.LAT_LA_ID = LINK_ART.LA_ID\r\n                  AND LINK_LA_TYP.LAT_TYPE = 2\r\n             \r\n           INNER JOIN PASSENGER_CARS ON PASSENGER_CARS.PC_ID = LINK_LA_TYP.LAT_TYP_ID\r\n         \r\n           INNER JOIN PC_COUNTRY_SPECIFICS ON PC_COUNTRY_SPECIFICS.PCS_PC_ID = PASSENGER_CARS.PC_ID\r\n               AND (PC_COUNTRY_SPECIFICS.PCS_COU_ID = @COUNTRY_FILTER OR PC_COUNTRY_SPECIFICS.PCS_COU_ID = 0)\r\n\r\n           INNER JOIN MODELS_SERIES ON MODELS_SERIES.MS_ID = PASSENGER_CARS.PC_MS_ID       \r\n\r\n           INNER JOIN MANUFACTURERS ON MANUFACTURERS.MFA_ID = PASSENGER_CARS.PC_MFA_ID\r\n\r\n          LEFT OUTER JOIN `MS_COUNTRY_SPECIFICS`\r\n                       ON `MS_COUNTRY_SPECIFICS`.`MSCS_ID` = `MODELS_SERIES`.`MS_ID`\r\n                      AND `MS_COUNTRY_SPECIFICS`.`MSCS_COU_ID` = @COUNTRY_FILTER \r\n    WHERE\r\n           LINK_ART.LA_ART_ID = @ART_ID"
  },
  {
    "id": "q_9",
    "filename": "get_accessories_list_for_article.sql",
    "titleEn": "Article Accessories & Optional Attachments",
    "category": "articles",
    "icon": "paperclip",
    "description": "Retrieves complementary accessories and optional attachment parts for an article.",
    "tables": [
      "ACCESSORIES",
      "ARTICLES",
      "PRODUCTS"
    ],
    "defaultParams": {
      "ART_ID": "1878343"
    },
    "sql": "  SET @ART_ID = 1759869; /* HELLA 1A3 005 760-518 */\r\n    \r\n    SELECT \r\n          ARTICLES.ART_ID,\r\n          ARTICLES.ART_ARTICLE_NR,\r\n          get_text(ARTICLES.ART_DES_ID, @LNGID) AS ART_DES_TEXT,\r\n          get_text(KEY_VALUES.KV_DES_ID, @LNGID) AS ART_STATUS_TEXT,\r\n-- ---------------------------------------------------------------             \r\n          CONCAT_WS(' ',\r\n                    (SELECT \r\n                           get_text(PRODUCTS.PT_DES_ID, @LNGID)\r\n                     FROM\r\n                           LINK_ART_PT\r\n                           INNER JOIN PRODUCTS ON PRODUCTS.PT_ID = LINK_ART_PT.LAP_PT_ID\r\n                     WHERE\r\n                           LINK_ART_PT.LAP_ART_ID = ARTICLES.ART_ID \r\n\t\t\t\t\t LIMIT 1), \r\n                           \r\n\t\t\t\t\t get_text(ARTICLES.ART_DES_ID, @LNGID) ) AS ART_PRODUCT_NAME,\r\n-- ---------------------------------------------------------------              \r\n          (SELECT\r\n                 GROUP_CONCAT( \r\n                              CONCAT_WS(': ', get_text(CRITERIA.CRI_SHORT_DES_ID, @LNGID), \r\n                                (CASE\r\n                                     WHEN CRITERIA.CRI_TYPE = 3 \r\n\t\t\t\t\t\t\t\t\t\t THEN \r\n                                           get_text_kt(ARTICLE_CRITERIA.ACR_KV_KT_ID, ARTICLE_CRITERIA.ACR_VALUE, @LNGID) \r\n                                     ELSE\r\n                                        ARTICLE_CRITERIA.ACR_VALUE\r\n                                END) )\r\n                 SEPARATOR '; ')\r\n          FROM\r\n                 ARTICLE_CRITERIA\r\n                 INNER JOIN CRITERIA ON ARTICLE_CRITERIA.ACR_CRI_ID = CRITERIA.CRI_ID\r\n\r\n                 INNER JOIN COUNTRY_RESTRICTIONS ON COUNTRY_RESTRICTIONS.CNTR_ID = ARTICLE_CRITERIA.ACR_CTM\r\n                        AND COUNTRY_RESTRICTIONS.CNTR_COU_ID = @COUNTRY_FILTER\r\n          WHERE\r\n                 ARTICLE_CRITERIA.ACR_ART_ID = ARTICLES.ART_ID \r\n                 AND ARTICLE_CRITERIA.ACR_DISPLAY = 1 LIMIT 4 ) AS ARTICLE_CRITERIA\r\n-- ---------------------------------------------------------------\r\n        \r\n    FROM\r\n        ART_ACCS_LIST\r\n        INNER JOIN ARTICLES ON ARTICLES.ART_ID = ART_ACCS_LIST.ART_ACCS_ID\r\n        \r\n        INNER JOIN ART_COUNTRY_SPECIFICS ON ART_COUNTRY_SPECIFICS.ACS_ART_ID = ARTICLES.ART_ID\r\n            AND (ART_COUNTRY_SPECIFICS.ACS_COU_ID = @COUNTRY_FILTER OR ART_COUNTRY_SPECIFICS.ACS_COU_ID = 0)\r\n        \r\n        LEFT OUTER JOIN KEY_VALUES ON KEY_VALUES.KV_KT_ID = 73\r\n            AND KEY_VALUES.KV_KV = ART_COUNTRY_SPECIFICS.ACS_STATUS_KV_KV\r\n            \r\n    WHERE\r\n        ART_ACCS_LIST.ART_ACCS_PARENT_ID = @ART_ID"
  },
  {
    "id": "q_10",
    "filename": "get_articles_by_product_group_and_brand.sql",
    "titleEn": "Articles for Product Group & Manufacturer Brand",
    "category": "articles",
    "icon": "list",
    "description": "Lists all spare parts in a specific catalog category node for a chosen brand.",
    "tables": [
      "ARTICLES",
      "LINK_ART_GA",
      "SEARCH_TREE",
      "PRODUCTS"
    ],
    "defaultParams": {
      "PC_ID": "9877",
      "PT_ID": "417",
      "SUP_ID": "268",
      "LINK_TYPE": "2",
      "COUNTRY_FILTER": "14",
      "LNGID": "4",
      "STR_ID": "100005",
      "MFA_ID": "16",
      "COU_ID": "0",
      "STR_TYPE": "1"
    },
    "sql": "SET @PC_ID = 12423; \n    SET @PT_ID = 417; /* Hydraulic Filter, steering system */ \n    SET @SUP_ID = 268; /* JP GROUP */ \n    SET @LINK_TYPE= 2; /* passenger cars */ \n SET @COUNTRY_FILTER = '14';\r\n   SET @LNGID = 4; /* BOSCH 0 001 106 016 */\t\n \n    SELECT DISTINCT\n           ARTICLES.ART_ID,\n           ARTICLES.ART_ARTICLE_NR,\n            ART_COUNTRY_SPECIFICS.ACS_STATUS_KV_KV,\n           get_text_kt(73,  ART_COUNTRY_SPECIFICS.ACS_STATUS_KV_KV, @LNGID) AS ART_STATUS_TEXT,\n                       \n           get_text(PRODUCTS.PT_DES_ID, @LNGID) AS DESCRIPTIONS,\n/* ------------------------------------------- */                 \n          (SELECT \n                CONCAT_WS(0x0a0d2d, get_text_kt(72, ARTICLE_INFO.AIN_KV_TYPE, @LNGID), \n                                    GROUP_CONCAT( DISTINCT(TEXT_MODULE_TEXTS.TMT_TEXT) SEPARATOR 0x0a0d2d ) )\n           FROM\n                 ARTICLE_INFO\n                 LEFT OUTER JOIN TEXT_MODULE_TEXTS ON TEXT_MODULE_TEXTS.TMT_ID = ARTICLE_INFO.AIN_TMT_ID\n                      AND (TEXT_MODULE_TEXTS.TMT_LNG_ID = 255 OR TEXT_MODULE_TEXTS.TMT_LNG_ID = @LNGID)\n           WHERE\n                 ARTICLE_INFO.AIN_ART_ID = ARTICLES.ART_ID AND ARTICLE_INFO.AIN_DISPLAY = 1) AS ART_INFO,\n/* ------------------------------------------- */             \n         (SELECT\n                 GROUP_CONCAT( \n                              CONCAT_WS(': ', get_text(CRITERIA.CRI_DES_ID, @LNGID), \n                                (CASE\n                                     WHEN CRITERIA.CRI_TYPE = 3 \n\t\t\t\t\t\t\t\t\t\t THEN \n                                           get_text_kt(ARTICLE_CRITERIA.ACR_KV_KT_ID, ARTICLE_CRITERIA.ACR_VALUE, @LNGID) \n                                     ELSE\n                                        ARTICLE_CRITERIA.ACR_VALUE\n                                END) )\n                 SEPARATOR '; ')\n          FROM\n                 ARTICLE_CRITERIA\n                 INNER JOIN CRITERIA ON ARTICLE_CRITERIA.ACR_CRI_ID = CRITERIA.CRI_ID\n\n                 INNER JOIN COUNTRY_RESTRICTIONS ON COUNTRY_RESTRICTIONS.CNTR_ID = ARTICLE_CRITERIA.ACR_CTM\n                        AND COUNTRY_RESTRICTIONS.CNTR_COU_ID = @COUNTRY_FILTER\n          WHERE\n                 ARTICLE_CRITERIA.ACR_ART_ID = ARTICLES.ART_ID AND ARTICLE_CRITERIA.ACR_DISPLAY = 1) AS ARTICLE_CRITERIA,\n/* ------------------------------------------- */             \n         (SELECT \n                 GROUP_CONCAT( \n                              CONCAT_WS(': ', get_text(CRITERIA.CRI_DES_ID, @LNGID), \n                                (CASE\n                                     WHEN CRITERIA.CRI_TYPE = 3 \n\t\t\t\t\t\t\t\t\t\t THEN \n                                           get_text_kt(LA_CRITERIA.LAC_KV_KT_ID, LA_CRITERIA.LAC_VALUE, @LNGID) \n                                     ELSE\n                                        LA_CRITERIA.LAC_VALUE\n                                END) )\n                 SEPARATOR '; ')\n          FROM \n                 LA_CRITERIA\n                 INNER JOIN CRITERIA ON LA_CRITERIA.LAC_CRI_ID = CRITERIA.CRI_ID\n          WHERE \n                 LA_CRITERIA.LAC_LA_ID = LINK_LA_TYP.LAT_LA_ID AND LA_CRITERIA.LAC_DISPLAY = 1) AS LA_ARTICLE_CRITERIA\n/* ------------------------------------------- */ \n    FROM \n           LINK_LA_TYP\n                \n           INNER JOIN LINK_ART ON LINK_ART.LA_ID = LINK_LA_TYP.LAT_LA_ID\n \n           INNER JOIN ARTICLES ON ARTICLES.ART_ID = LINK_ART.LA_ART_ID\n        \n           INNER JOIN ART_COUNTRY_SPECIFICS ON ART_COUNTRY_SPECIFICS.ACS_ART_ID = ARTICLES.ART_ID\n                  AND (ART_COUNTRY_SPECIFICS.ACS_COU_ID = @COUNTRY_FILTER OR ART_COUNTRY_SPECIFICS.ACS_COU_ID = 0)\n         \n           INNER JOIN SUPPLIERS ON SUPPLIERS.SUP_ID = LINK_LA_TYP.LAT_SUP_ID\n           INNER JOIN PRODUCTS ON PRODUCTS.PT_ID = LINK_LA_TYP.LAT_PT_ID\n            \n    WHERE\n           LINK_LA_TYP.LAT_TYP_ID = @PC_ID \n                  AND LINK_LA_TYP.LAT_TYPE = @LINK_TYPE \n                  AND LINK_LA_TYP.LAT_PT_ID = @PT_ID\n                  AND LINK_LA_TYP.LAT_SUP_ID = @SUP_ID"
  },
  {
    "id": "q_11",
    "filename": "get_graphics_and_documents_for_article.sql",
    "titleEn": "Article Images, WebP Media & Technical Drawings",
    "category": "articles",
    "icon": "image",
    "description": "Retrieves image document IDs, URLs/WebP paths, and media type designations for an article.",
    "tables": [
      "ART_MEDIA_INFO",
      "DOC_TYPES",
      "ARTICLES"
    ],
    "defaultParams": {
      "ART_ID": "1878343"
    },
    "sql": "SET @ART_ID = 1830460; /* SPIDAN 20064 */ \r\n  \r\n\r\n    SELECT \r\n          ART_MEDIA_INFO.ART_MEDIA_TYPE,\r\n /*-------------------------------------*/ \r\n          (CASE\r\n               WHEN ART_MEDIA_INFO.ART_MEDIA_TYPE = 4\r\n\t\t  THEN ART_MEDIA_INFO.ART_MEDIA_HIPPERLINK \r\n               WHEN ART_MEDIA_INFO.ART_MEDIA_TYPE = 2\r\n                  THEN CONCAT_WS('/', 'pdf', ART_MEDIA_INFO.ART_MEDIA_SUP_ID, ART_MEDIA_INFO.ART_MEDIA_FILE_NAME)\r\n               ELSE\r\n                  CONCAT_WS('/', 'img',  ART_MEDIA_INFO.ART_MEDIA_SUP_ID, ART_MEDIA_INFO.ART_MEDIA_FILE_NAME )\r\n          END) AS ART_MEDIA_SOURCE,\r\n /*-------------------------------------*/ \r\n          ART_MEDIA_INFO.ART_MEDIA_SUP_ID,\r\n          get_text(ART_MEDIA_INFO.ART_MEDIA_NORM, @LNGID) \r\n    FROM\r\n          ART_MEDIA_INFO\r\n    WHERE\r\n          ART_MEDIA_INFO.ART_ID = @ART_ID"
  },
  {
    "id": "q_12",
    "filename": "get_car_models_for_model_series.sql",
    "titleEn": "Passenger Car Models for Model Series",
    "category": "vehicles",
    "icon": "git-branch",
    "description": "Lists all specific engine/trim modifications for a given vehicle model series (e.g. BMW E82).",
    "tables": [
      "PASSENGER_CARS",
      "MODELS_SERIES",
      "PC_COUNTRY_SPECIFICS"
    ],
    "defaultParams": {
      "MSID": "348",
      "MS_ID": "5877"
    },
    "sql": " SET @MSID = 348; -- FIAT ARGENTA (132_)\r\n   \r\n   SELECT\r\n         CONCAT_WS(' ', MFA_BRAND,  \r\n                 get_text(IFNULL(`MS_COUNTRY_SPECIFICS`.`MSCS_NAME_DES`,`MODELS_SERIES`.`MS_NAME_DES`), @LNGID),\r\n                 get_text(PASSENGER_CARS.PC_MODEL_DES, @LNGID) ) AS TYPEL,\r\n         PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_START,\r\n         PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_END,\r\n         PC_COUNTRY_SPECIFICS.PCS_POWER_KW,\r\n         PC_COUNTRY_SPECIFICS.PCS_POWER_PS,\r\n         PC_COUNTRY_SPECIFICS.PCS_CAPACITY_TAX,\r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_BODY_TYPE, @LNGID)\r\n   FROM \r\n         PASSENGER_CARS\r\n  \r\n         INNER JOIN PC_COUNTRY_SPECIFICS ON PC_COUNTRY_SPECIFICS.PCS_PC_ID = PASSENGER_CARS.PC_ID\r\n               AND (PC_COUNTRY_SPECIFICS.PCS_COU_ID = @COUNTRY_FILTER OR PC_COUNTRY_SPECIFICS.PCS_COU_ID = 0)\r\n         \r\n         INNER JOIN MODELS_SERIES ON MODELS_SERIES.MS_ID = @MSID\r\n         \r\n         INNER JOIN MANUFACTURERS ON MANUFACTURERS.MFA_ID = PASSENGER_CARS.PC_MFA_ID\r\n         \r\n         LEFT OUTER JOIN `MS_COUNTRY_SPECIFICS`\r\n                      ON `MS_COUNTRY_SPECIFICS`.`MSCS_ID` = `MODELS_SERIES`.`MS_ID`\r\n                     AND `MS_COUNTRY_SPECIFICS`.`MSCS_COU_ID` = @COUNTRY_FILTER \r\n\t\t\r\n   WHERE \r\n         PASSENGER_CARS.PC_MS_ID = @MSID  \r\n         AND MODELS_SERIES.MS_PC = 1"
  },
  {
    "id": "q_13",
    "filename": "get_model_series_for_car_manufacturer.sql",
    "titleEn": "Model Series for Passenger Car Manufacturer",
    "category": "vehicles",
    "icon": "layers",
    "description": "Lists all model generations and series for a selected automaker (e.g. BMW 1 Series, 3 Series, 5 Series).",
    "tables": [
      "MODELS_SERIES",
      "MANUFACTURERS"
    ],
    "defaultParams": {
      "MFAID": "35",
      "MFA_ID": "16"
    },
    "sql": "# SET @MFAID = 35; /* FIAT */\n   SELECT MANUFACTURERS.MFA_BRAND,\n          get_text(IFNULL(`MS_COUNTRY_SPECIFICS`.`MSCS_NAME_DES`,`MODELS_SERIES`.`MS_NAME_DES`), @LNGID) AS 'MS_NAME',\n         `MODELS_SERIES`.`MS_CI_FROM`,\n         `MODELS_SERIES`.`MS_CI_TO`\n   FROM \n         `MODELS_SERIES`\n          LEFT OUTER JOIN `MS_COUNTRY_SPECIFICS`\n                       ON `MS_COUNTRY_SPECIFICS`.`MSCS_ID` = `MODELS_SERIES`.`MS_ID`\n                      AND `MS_COUNTRY_SPECIFICS`.`MSCS_COU_ID` = 51 \r\n\t\t\t\t\tINNER JOIN MANUFACTURERS ON MANUFACTURERS.MFA_ID = `MODELS_SERIES`.`MS_MFA_ID`\n   WHERE  \n         `MODELS_SERIES`.`MS_MFA_ID` = 35\n          AND`MODELS_SERIES`.`MS_PC` = 1"
  },
  {
    "id": "q_14",
    "filename": "get_manufacturers_for_passenger_cars.sql",
    "titleEn": "Passenger Car Manufacturers List",
    "category": "vehicles",
    "icon": "shield",
    "description": "Lists all automotive brands and marques that manufacture passenger cars.",
    "tables": [
      "MANUFACTURERS"
    ],
    "defaultParams": {},
    "sql": "   SELECT \r\n         MFA_BRAND\r\n   FROM \r\n         MANUFACTURERS\r\n   WHERE \r\n         MANUFACTURERS.MFA_PC = 1 \r\n   ORDER BY MFA_BRAND;"
  },
  {
    "id": "q_15",
    "filename": "search_part_analogs_by_number.sql",
    "titleEn": "Part Analog & Replacement Search by Part Number",
    "category": "crosses",
    "icon": "refresh-cw",
    "description": "Finds OEM and aftermarket replacement analogs by searching clean part number.",
    "tables": [
      "ART_LOOKUP",
      "ARTICLES",
      "MANUFACTURERS"
    ],
    "defaultParams": {
      "SEARCH_NUMBER": "20430",
      "COUNTRY_FILTER": "4",
      "LNGID": "4",
      "KIND": "1"
    },
    "sql": " SET @SEARCH_NUMBER = '5302';\r\n SET @COUNTRY_FILTER = '4';\n   SET @LNGID = 4;\r\n\t\tSET SESSION group_concat_max_len = 10000000;\r\n\t\t\n    SELECT distinct\n          ARTICLES.ART_ID, \n          ARTICLES.ART_ARTICLE_NR,\r\n\t\t\t\t\t#ART_LOOKUP.ARL_SEARCH_NUMBER,\n          ARTICLES.ART_SUP_BRAND,\n          CONCAT_WS(' ', get_text(ARTICLES.ART_COMPLETE_DES_ID, @LNGID), get_text(ARTICLES.ART_DES_ID, @LNGID) ) AS ART_PRODUCT_NAME,\n          #ART_LOOKUP.ARL_KIND AS FOUND_VIA\r\n\t\t\t\t\t CASE\r\n                WHEN ART_LOOKUP.ARL_KIND = 1 THEN 'Manufacturer Article Number'\r\n                WHEN ART_LOOKUP.ARL_KIND = 2 THEN 'Trade Number'\r\n                WHEN ART_LOOKUP.ARL_KIND = 3 THEN 'OEM Original Equipment Replacement'\r\n\t\t\t\t\t\t\t\tWHEN ART_LOOKUP.ARL_KIND = 4 THEN 'Aftermarket Interchange Replacement'\r\n                END AS 'FOUND_IN'\n          \n    FROM \n          ART_LOOKUP\n          INNER JOIN ARTICLES ON ARTICLES.ART_ID = ART_LOOKUP.ARL_ART_ID\n          INNER JOIN COUNTRY_RESTRICTIONS ON COUNTRY_RESTRICTIONS.CNTR_ID = ARTICLES.ART_CTM\n                 AND COUNTRY_RESTRICTIONS.CNTR_COU_ID = @COUNTRY_FILTER\n  \n    WHERE \n          ART_LOOKUP.ARL_SEARCH_NUMBER = @SEARCH_NUMBER# and ART_LOOKUP.ARL_KIND=4\n            \n    ORDER BY ARTICLES.ART_SUP_BRAND;"
  },
  {
    "id": "q_16",
    "filename": "search_product_group_tree_by_keyword.sql",
    "titleEn": "Search Product Group Tree by Keyword Description",
    "category": "trees",
    "icon": "search",
    "description": "Full-text search through assembly hierarchy nodes (e.g. \"brake\", \"filter\", \"suspension\").",
    "tables": [
      "SEARCH_TREE",
      "DESIGNATIONS"
    ],
    "defaultParams": {
      "PC_ID": "12423",
      "STR_TYPE": "7",
      "SEARCH_TEXT": "%brake%",
      "LNGID": "4"
    },
    "sql": "SET @PC_ID = 12423;\r\n    SET @STR_TYPE=7; /* universal product selection */\r\n\r\n    SELECT DISTINCT\r\n         SEARCH_TREE.STR_LEVEL,\r\n/* ------------------------------------------- */        \r\n         ELT(SEARCH_TREE.STR_LEVEL, \r\n             get_text(SEARCH_TREE.STR_DES_ID , @LNGID),\r\n             get_text(PARENT_NODE1.STR_DES_ID , @LNGID),  \r\n             get_text(PARENT_NODE2.STR_DES_ID , @LNGID), \r\n             get_text(PARENT_NODE3.STR_DES_ID , @LNGID) ) AS ROOT_NODE_TEXT,\r\n\r\n          ELT(SEARCH_TREE.STR_LEVEL, \r\n              SEARCH_TREE.STR_ID, \r\n              PARENT_NODE1.STR_ID, \r\n              PARENT_NODE2.STR_ID, \r\n              PARENT_NODE3.STR_ID) AS ROOT_NODE_STR_ID,\r\n/* ------------------------------------------- */            \r\n          ELT(SEARCH_TREE.STR_LEVEL-1, \r\n              get_text(SEARCH_TREE.STR_DES_ID , @LNGID),\r\n              get_text(PARENT_NODE1.STR_DES_ID , @LNGID),  \r\n              get_text(PARENT_NODE2.STR_DES_ID , @LNGID), \r\n              get_text(PARENT_NODE3.STR_DES_ID , @LNGID) ) AS NODE_1_TEXT,\r\n\r\n          ELT(SEARCH_TREE.STR_LEVEL-1, \r\n              SEARCH_TREE.STR_ID, \r\n              PARENT_NODE1.STR_ID, \r\n              PARENT_NODE2.STR_ID, \r\n              PARENT_NODE3.STR_ID) AS NODE_1_STR_ID, \r\n/* ------------------------------------------- */            \r\n          ELT(SEARCH_TREE.STR_LEVEL-2, \r\n              get_text(SEARCH_TREE.STR_DES_ID , @LNGID),\r\n              get_text(PARENT_NODE1.STR_DES_ID , @LNGID),  \r\n              get_text(PARENT_NODE2.STR_DES_ID , @LNGID), \r\n              get_text(PARENT_NODE3.STR_DES_ID , @LNGID)) AS NODE_2_TEXT,\r\n\r\n          ELT(SEARCH_TREE.STR_LEVEL-2, \r\n              SEARCH_TREE.STR_ID, \r\n              PARENT_NODE1.STR_ID, \r\n              PARENT_NODE2.STR_ID, \r\n              PARENT_NODE3.STR_ID) AS NODE_2_STR_ID, \r\n/* ------------------------------------------- */            \r\n          ELT(SEARCH_TREE.STR_LEVEL-3, \r\n              get_text(SEARCH_TREE.STR_DES_ID , @LNGID),\r\n              get_text(PARENT_NODE1.STR_DES_ID , @LNGID),  \r\n              get_text(PARENT_NODE2.STR_DES_ID , @LNGID), \r\n              get_text(PARENT_NODE3.STR_DES_ID , @LNGID) ) AS NODE_3_TEXT,\r\n\r\n          ELT(SEARCH_TREE.STR_LEVEL-3, \r\n              SEARCH_TREE.STR_ID, \r\n              PARENT_NODE1.STR_ID, \r\n              PARENT_NODE2.STR_ID, \r\n              PARENT_NODE3.STR_ID) AS NODE_3_STR_ID\r\n/* ------------------------------------------- */         \r\n    FROM\r\n        STR_LOOKUP\r\n        \r\n        INNER JOIN LINK_PT_STR ON LINK_PT_STR.PT_ID = STR_LOOKUP.STL_PT_ID\r\n         \r\n        INNER JOIN SEARCH_TREE ON SEARCH_TREE.STR_ID = LINK_PT_STR.STR_ID \r\n              AND SEARCH_TREE.STR_TYPE = @STR_TYPE\r\n              \r\n        LEFT JOIN SEARCH_TREE AS PARENT_NODE1 ON PARENT_NODE1.STR_ID = SEARCH_TREE.STR_ID_PARENT \r\n              AND PARENT_NODE1.STR_TYPE = @STR_TYPE\r\n              \r\n        LEFT JOIN SEARCH_TREE AS PARENT_NODE2 ON PARENT_NODE2.STR_ID = PARENT_NODE1.STR_ID_PARENT \r\n              AND PARENT_NODE2.STR_TYPE = @STR_TYPE\r\n               \r\n        LEFT JOIN SEARCH_TREE AS PARENT_NODE3 ON PARENT_NODE3.STR_ID = PARENT_NODE2.STR_ID_PARENT\r\n              AND PARENT_NODE3.STR_TYPE = @STR_TYPE\r\n               \r\n    WHERE\r\n        STR_LOOKUP.STL_SEARCH_TEXT LIKE '%VALVE'"
  },
  {
    "id": "q_17",
    "filename": "search_passenger_car_by_kba_number.sql",
    "titleEn": "Vehicle Identification by German KBA Number",
    "category": "plates",
    "icon": "file-text",
    "description": "German KBA (Kraftfahrt-Bundesamt) HSN/TSN number vehicle identification and specs.",
    "tables": [
      "KBA",
      "PASSENGER_CARS",
      "MANUFACTURERS",
      "MODELS_SERIES"
    ],
    "defaultParams": {
      "KBA_NUM": "0005/AZC",
      "TYPE_NUM_COU_CODE": "D",
      "LNGID": "4"
    },
    "sql": "SET @KBA_NUM = '0588549';\r\n   SET @TYPE_NUM_COU_CODE = 'D';\r\n   \r\n   SELECT\r\n         CONCAT( MFA_BRAND, ' ',  \r\n                 get_text(IFNULL(`MS_COUNTRY_SPECIFICS`.`MSCS_NAME_DES`,`MODELS_SERIES`.`MS_NAME_DES`), @LNGID), ' ', \r\n                 get_text(PASSENGER_CARS.PC_MODEL_DES, @LNGID) ) AS TYPEL,\r\n         PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_START,\r\n         PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_END,\r\n         PC_COUNTRY_SPECIFICS.PCS_POWER_KW,\r\n         PC_COUNTRY_SPECIFICS.PCS_POWER_PS,\r\n         PC_COUNTRY_SPECIFICS.PCS_CAPACITY_TAX,\r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_BODY_TYPE, @LNGID)\r\n   FROM \r\n         TYPE_NUMBERS\r\n         INNER JOIN PASSENGER_CARS ON PASSENGER_CARS.PC_ID = TYPE_NUMBERS.PC_ID\r\n         \r\n         INNER JOIN PC_COUNTRY_SPECIFICS ON PC_COUNTRY_SPECIFICS.PCS_PC_ID = PASSENGER_CARS.PC_ID\r\n               AND (PC_COUNTRY_SPECIFICS.PCS_COU_ID = @COUNTRY_FILTER OR PC_COUNTRY_SPECIFICS.PCS_COU_ID = 0)\r\n         \r\n         INNER JOIN MODELS_SERIES ON MODELS_SERIES.MS_ID = PASSENGER_CARS.PC_MS_ID\r\n         \r\n         INNER JOIN MANUFACTURERS ON MANUFACTURERS.MFA_ID = PASSENGER_CARS.PC_MFA_ID\r\n         \r\n         LEFT OUTER JOIN MS_COUNTRY_SPECIFICS\r\n                      ON MS_COUNTRY_SPECIFICS.MSCS_ID = MODELS_SERIES.MS_ID\r\n                     AND MS_COUNTRY_SPECIFICS.MSCS_COU_ID = @COUNTRY_FILTER \r\n\t \r\n   WHERE \r\n\t TYPE_NUMBERS.TYP_NUM = @KBA_NUM\r\n        AND TYPE_NUMBERS.COU_CODE = @TYPE_NUM_COU_CODE"
  },
  {
    "id": "q_18",
    "filename": "search_passenger_car_by_dutch_kenteken.sql",
    "titleEn": "Vehicle Lookup by Netherlands Kenteken License Plate",
    "category": "plates",
    "icon": "navigation",
    "description": "Dutch license plate lookup to decode car model, engine, and build dates via TYPE_NUMBERS.",
    "tables": [
      "TYPE_NUMBERS",
      "PASSENGER_CARS",
      "PC_COUNTRY_SPECIFICS"
    ],
    "defaultParams": {
      "KENTEKEN_NUM": "2VXT04",
      "TYPE_NUM_COU_CODE": "NL"
    },
    "sql": "SET @KENTEKEN_NUM = '2VXT04';\r\n   SET @TYPE_NUM_COU_CODE = 'NL';\r\n   \r\n   SELECT\r\n         CONCAT( MFA_BRAND, ' ',  \r\n                 get_text(IFNULL(`MS_COUNTRY_SPECIFICS`.`MSCS_NAME_DES`,`MODELS_SERIES`.`MS_NAME_DES`), @LNGID), ' ', \r\n                 get_text(PASSENGER_CARS.PC_MODEL_DES, @LNGID) ) AS TYPEL,\r\n         PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_START,\r\n         PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_END,\r\n         PC_COUNTRY_SPECIFICS.PCS_POWER_KW,\r\n         PC_COUNTRY_SPECIFICS.PCS_POWER_PS,\r\n         PC_COUNTRY_SPECIFICS.PCS_CAPACITY_TAX,\r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_BODY_TYPE, @LNGID)\r\n   FROM \r\n         TYPE_NUMBERS\r\n         INNER JOIN PASSENGER_CARS ON PASSENGER_CARS.PC_ID = TYPE_NUMBERS.PC_ID\r\n         \r\n         INNER JOIN PC_COUNTRY_SPECIFICS ON PC_COUNTRY_SPECIFICS.PCS_PC_ID = PASSENGER_CARS.PC_ID\r\n               AND (PC_COUNTRY_SPECIFICS.PCS_COU_ID = @COUNTRY_FILTER OR PC_COUNTRY_SPECIFICS.PCS_COU_ID = 0)\r\n         \r\n         INNER JOIN MODELS_SERIES ON MODELS_SERIES.MS_ID = PASSENGER_CARS.PC_MS_ID\r\n         \r\n         INNER JOIN MANUFACTURERS ON MANUFACTURERS.MFA_ID = PASSENGER_CARS.PC_MFA_ID\r\n         \r\n         LEFT OUTER JOIN `MS_COUNTRY_SPECIFICS`\r\n                      ON `MS_COUNTRY_SPECIFICS`.`MSCS_ID` = `MODELS_SERIES`.`MS_ID`\r\n                     AND `MS_COUNTRY_SPECIFICS`.`MSCS_COU_ID` = @COUNTRY_FILTER \r\n   WHERE \r\n         TYPE_NUMBERS.TYP_NUM = @KENTEKEN_NUM\r\n\t\t AND TYPE_NUMBERS.COU_CODE = @TYPE_NUM_COU_CODE"
  },
  {
    "id": "q_19",
    "filename": "search_passenger_car_by_french_cartes_grises.sql",
    "titleEn": "Vehicle Lookup by French Cartes Grises Type Mines",
    "category": "plates",
    "icon": "hash",
    "description": "French registration document type code lookup for precise vehicle identification.",
    "tables": [
      "TYPE_NUMBERS",
      "PASSENGER_CARS",
      "PC_COUNTRY_SPECIFICS"
    ],
    "defaultParams": {
      "CARTES_GRISES_NUM": "M10MCDVPUL07391",
      "TYPE_NUM_COU_CODE": "F"
    },
    "sql": "SET @CARTES_GRISES_NUM = 'M10MCDVPUL07391';\r\n   SET @TYPE_NUM_COU_CODE = 'F';\r\n   \r\n   SELECT DISTINCT\r\n         CONCAT( MFA_BRAND, ' ',  \r\n                 get_text(IFNULL(`MS_COUNTRY_SPECIFICS`.`MSCS_NAME_DES`,`MODELS_SERIES`.`MS_NAME_DES`), @LNGID), ' ', \r\n                 get_text(PASSENGER_CARS.PC_MODEL_DES, @LNGID) ) AS TYPEL,\r\n         PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_START,\r\n         PC_COUNTRY_SPECIFICS.PCS_CONSTRUCTION_INTERVAL_END,\r\n         PC_COUNTRY_SPECIFICS.PCS_POWER_KW,\r\n         PC_COUNTRY_SPECIFICS.PCS_POWER_PS,\r\n         PC_COUNTRY_SPECIFICS.PCS_CAPACITY_TAX,\r\n         get_text(PC_COUNTRY_SPECIFICS.PCS_BODY_TYPE, @LNGID)\r\n   FROM \r\n         TYPE_NUMBERS\r\n         INNER JOIN PASSENGER_CARS ON PASSENGER_CARS.PC_ID = TYPE_NUMBERS.PC_ID\r\n         \r\n         INNER JOIN PC_COUNTRY_SPECIFICS ON PC_COUNTRY_SPECIFICS.PCS_PC_ID = PASSENGER_CARS.PC_ID\r\n               AND (PC_COUNTRY_SPECIFICS.PCS_COU_ID = @COUNTRY_FILTER OR PC_COUNTRY_SPECIFICS.PCS_COU_ID = 0)\r\n         \r\n         INNER JOIN MODELS_SERIES ON MODELS_SERIES.MS_ID = PASSENGER_CARS.PC_MS_ID\r\n         \r\n         INNER JOIN MANUFACTURERS ON MANUFACTURERS.MFA_ID = PASSENGER_CARS.PC_MFA_ID\r\n         \r\n         LEFT OUTER JOIN `MS_COUNTRY_SPECIFICS`\r\n                      ON `MS_COUNTRY_SPECIFICS`.`MSCS_ID` = `MODELS_SERIES`.`MS_ID`\r\n                     AND `MS_COUNTRY_SPECIFICS`.`MSCS_COU_ID` = @COUNTRY_FILTER \r\n\t \r\n   WHERE \r\n         TYPE_NUMBERS.TYP_NUM = @CARTES_GRISES_NUM\r\n\t\t AND TYPE_NUMBERS.COU_CODE = @TYPE_NUM_COU_CODE"
  },
  {
    "id": "q_20",
    "filename": "get_all_crosses_for_article.sql",
    "titleEn": "All Cross-References & OE Equivalents for Article",
    "category": "crosses",
    "icon": "repeat",
    "description": "Bi-directional cross-reference resolution (OEM numbers and competitor aftermarket references).",
    "tables": [
      "ART_LOOKUP",
      "ARTICLES",
      "MANUFACTURERS"
    ],
    "defaultParams": {
      "ART_ID": "1878343"
    },
    "sql": "  SET @ART_ID = 1878343; /* SPIDAN 20430 */\r\n   \r\n   SELECT DISTINCT * \r\n        \r\n   FROM (\r\n   (SELECT\r\n          ARTICLES.ART_ID, \r\n          ARTICLES.ART_ARTICLE_NR,\r\n          ARTICLES.ART_SUP_BRAND,\r\n          CONCAT_WS(' ', get_text(ARTICLES.ART_COMPLETE_DES_ID, @LNGID), get_text(ARTICLES.ART_DES_ID, @LNGID) ) AS ART_PRODUCT_NAME\r\n          \r\n    FROM \r\n          ART_LOOKUP\r\n          INNER JOIN MANUFACTURERS ON MANUFACTURERS.MFA_ID = ART_LOOKUP.ARL_BRA_ID\r\n          INNER JOIN ART_LOOKUP AS ART_LOOKUP_CROSS ON ART_LOOKUP_CROSS.ARL_SEARCH_NUMBER = ART_LOOKUP.ARL_SEARCH_NUMBER\r\n                 AND ART_LOOKUP_CROSS.ARL_KIND = 1\r\n                 AND ART_LOOKUP_CROSS.ARL_BRA_ID = MANUFACTURERS.MFA_SUP_ID\r\n          \r\n          INNER JOIN ARTICLES ON ARTICLES.ART_ID = ART_LOOKUP_CROSS.ARL_ART_ID\r\n    WHERE \r\n          ART_LOOKUP.ARL_ART_ID = @ART_ID AND ART_LOOKUP.ARL_KIND = 4)\r\n          \r\n UNION ALL \r\n     -- getting cross articles provided by other supplier to the SPIDAN 20430\r\n    (SELECT\r\n          ARTICLES.ART_ID, \r\n          ARTICLES.ART_ARTICLE_NR,\r\n          ARTICLES.ART_SUP_BRAND,\r\n          CONCAT_WS(' ', get_text(ARTICLES.ART_COMPLETE_DES_ID, @LNGID), get_text(ARTICLES.ART_DES_ID, @LNGID) ) AS ART_PRODUCT_NAME\r\n          \r\n    FROM \r\n          ART_LOOKUP \r\n          INNER JOIN MANUFACTURERS ON MANUFACTURERS.MFA_SUP_ID = ART_LOOKUP.ARL_BRA_ID\r\n          INNER JOIN ART_LOOKUP AS ART_LOOKUP_CROSS ON ART_LOOKUP_CROSS.ARL_SEARCH_NUMBER = ART_LOOKUP.ARL_SEARCH_NUMBER\r\n                 AND ART_LOOKUP_CROSS.ARL_KIND = 4\r\n                 AND ART_LOOKUP_CROSS.ARL_BRA_ID =  MANUFACTURERS.MFA_ID\r\n          \r\n          INNER JOIN ARTICLES ON ARTICLES.ART_ID = ART_LOOKUP_CROSS.ARL_ART_ID\r\n    WHERE \r\n          ART_LOOKUP.ARL_ART_ID = @ART_ID AND ART_LOOKUP.ARL_KIND = 1) \r\n          \r\n  UNION ALL \r\n     -- getting OEM cross-references parts\r\n    (SELECT\r\n          NULL, \r\n          ART_LOOKUP.ARL_DISPLAY_NR,\r\n          ART_LOOKUP.ARL_BRA_BRAND,\r\n          CONCAT_WS(' ', get_text(ARTICLES.ART_COMPLETE_DES_ID, @LNGID), get_text(ARTICLES.ART_DES_ID, @LNGID) ) AS ART_PRODUCT_NAME\r\n          \r\n    FROM \r\n          ART_LOOKUP \r\n          INNER JOIN ARTICLES ON ARTICLES.ART_ID = @ART_ID\r\n    WHERE \r\n          ART_LOOKUP.ARL_ART_ID = @ART_ID AND ART_LOOKUP.ARL_KIND = 3)\r\n          \r\n  ) as CROSS_REFF"
  },
  {
    "id": "q_21",
    "filename": "get_diagram_hotspot_coordinates.sql",
    "titleEn": "Exploded Diagram Hotspot Sensitive Coordinates",
    "category": "crosses",
    "icon": "crosshair",
    "description": "Coordinates (X, Y, Width, Height) of interactive hotspots on assembly breakdown diagrams.",
    "tables": [
      "ART_PL_PIC_DATA",
      "SENSITIVE_COORDINATES",
      "ARTICLES"
    ],
    "defaultParams": {
      "ART_ID": "373681"
    },
    "sql": "SET @ART_ID = 373681; -- EBERSPÄCHER 032025\r\n\r\n    SELECT \r\n          ARTICLES.ART_ID,\r\n          ARTICLES.ART_ARTICLE_NR,\r\n          SENSITIVE_COORDINATES.SEN_COORD_ID,\r\n          SENSITIVE_COORDINATES.SEN_COORD_X,\r\n          SENSITIVE_COORDINATES.SEN_COORD_Y,\r\n          SENSITIVE_COORDINATES.SEN_COORD_WIDTH,\r\n          SENSITIVE_COORDINATES.SEN_COORD_HEIGHT,\r\n          SENSITIVE_COORDINATES.SEN_COORD_TYPE\r\n    FROM\r\n          ART_PL_PIC_DATA\r\n          INNER JOIN ARTICLES ON ARTICLES.ART_ID = ART_PL_PIC_DATA.APL_ART_ID_COMPONENT\r\n        \r\n          INNER JOIN SENSITIVE_COORDINATES ON SENSITIVE_COORDINATES.ART_PARENT_GRP_ID = ART_PL_PIC_DATA.APL_ART_ID\r\n                AND SENSITIVE_COORDINATES.SEN_COORD_ID = ART_PL_PIC_DATA.SEN_COORD_ID\r\n    WHERE\r\n          ART_PL_PIC_DATA.APL_ART_ID = @ART_ID"
  },
  {
    "id": "q_22",
    "filename": "build_product_tree_for_passenger_car.sql",
    "titleEn": "Build Product Tree Hierarchy for Passenger Vehicle",
    "category": "trees",
    "icon": "folder-tree",
    "description": "Builds multi-level assembly structure tree (Root -> Category -> Subcategory -> Assembly Group).",
    "tables": [
      "SEARCH_TREE",
      "LINK_GA_STR",
      "PASSENGER_CARS"
    ],
    "defaultParams": {
      "PC_ID": "9877",
      "STR_TYPE": "1",
      "LINK_TYPE": "2",
      "LNGID": "4"
    },
    "sql": "  SET @PC_ID = 9877; /* BMW, 1 Coupe (E82), M */\n    SET @STR_TYPE=1; /* passenger cars */\n    SET @LINK_TYPE= 2; /* passenger cars */\nSET @LNGID = 4;\r\n\n    SELECT DISTINCT\n         SEARCH_TREE.STR_LEVEL,\n/* ------------------------------------------- */       \n         ELT(SEARCH_TREE.STR_LEVEL, \n             get_text(SEARCH_TREE.STR_DES_ID , @LNGID),\n             get_text(PARENT_NODE1.STR_DES_ID , @LNGID),  \n             get_text(PARENT_NODE2.STR_DES_ID , @LNGID), \n             get_text(PARENT_NODE3.STR_DES_ID , @LNGID) ) AS ROOT_NODE_TEXT,\n\n          ELT(SEARCH_TREE.STR_LEVEL, \n              SEARCH_TREE.STR_ID, \n              PARENT_NODE1.STR_ID, \n              PARENT_NODE2.STR_ID, \n              PARENT_NODE3.STR_ID) AS ROOT_NODE_STR_ID,\n/* ------------------------------------------- */           \n          ELT(SEARCH_TREE.STR_LEVEL-1, \n              get_text(SEARCH_TREE.STR_DES_ID , @LNGID),\n              get_text(PARENT_NODE1.STR_DES_ID , @LNGID),  \n              get_text(PARENT_NODE2.STR_DES_ID , @LNGID), \n              get_text(PARENT_NODE3.STR_DES_ID , @LNGID) ) AS NODE_1_TEXT,\n\n          ELT(SEARCH_TREE.STR_LEVEL-1, \n              SEARCH_TREE.STR_ID, \n              PARENT_NODE1.STR_ID, \n              PARENT_NODE2.STR_ID, \n              PARENT_NODE3.STR_ID) AS NODE_1_STR_ID, \n/* ------------------------------------------- */           \n          ELT(SEARCH_TREE.STR_LEVEL-2, \n              get_text(SEARCH_TREE.STR_DES_ID , @LNGID),\n              get_text(PARENT_NODE1.STR_DES_ID , @LNGID),  \n              get_text(PARENT_NODE2.STR_DES_ID , @LNGID), \n              get_text(PARENT_NODE3.STR_DES_ID , @LNGID)) AS NODE_2_TEXT,\n\n          ELT(SEARCH_TREE.STR_LEVEL-2, \n              SEARCH_TREE.STR_ID, \n              PARENT_NODE1.STR_ID, \n              PARENT_NODE2.STR_ID, \n              PARENT_NODE3.STR_ID) AS NODE_2_STR_ID, \n/* ------------------------------------------- */           \n          ELT(SEARCH_TREE.STR_LEVEL-3, \n              get_text(SEARCH_TREE.STR_DES_ID , @LNGID),\n              get_text(PARENT_NODE1.STR_DES_ID , @LNGID),  \n              get_text(PARENT_NODE2.STR_DES_ID , @LNGID), \n              get_text(PARENT_NODE3.STR_DES_ID , @LNGID) ) AS NODE_3_TEXT,\n\n          ELT(SEARCH_TREE.STR_LEVEL-3, \n              SEARCH_TREE.STR_ID, \n              PARENT_NODE1.STR_ID, \n              PARENT_NODE2.STR_ID, \n              PARENT_NODE3.STR_ID) AS NODE_3_STR_ID\n/* ------------------------------------------- */        \n    FROM\n        LINK_LA_TYP \n        INNER JOIN LINK_PT_STR ON LINK_PT_STR.STR_TYPE = @STR_TYPE\n\t           AND LINK_PT_STR.PT_ID = LINK_LA_TYP.LAT_PT_ID \n            \n        INNER JOIN SEARCH_TREE ON SEARCH_TREE.STR_ID = LINK_PT_STR.STR_ID \n              AND SEARCH_TREE.STR_TYPE = @STR_TYPE\n              \n        LEFT JOIN SEARCH_TREE AS PARENT_NODE1 ON PARENT_NODE1.STR_ID = SEARCH_TREE.STR_ID_PARENT \n              AND PARENT_NODE1.STR_TYPE = @STR_TYPE\n              \n        LEFT JOIN SEARCH_TREE AS PARENT_NODE2 ON PARENT_NODE2.STR_ID = PARENT_NODE1.STR_ID_PARENT \n              AND PARENT_NODE2.STR_TYPE = @STR_TYPE\n               \n        LEFT JOIN SEARCH_TREE AS PARENT_NODE3 ON PARENT_NODE3.STR_ID = PARENT_NODE2.STR_ID_PARENT\n              AND PARENT_NODE3.STR_TYPE = @STR_TYPE\n               \n    WHERE\n        LINK_LA_TYP.LAT_TYP_ID = @PC_ID AND LINK_LA_TYP.LAT_TYPE = @LINK_TYPE\n\n    ORDER BY\n        ROOT_NODE_TEXT,\n        NODE_1_TEXT,\n        NODE_2_TEXT,\n        NODE_3_TEXT"
  },
  {
    "id": "q_23",
    "filename": "get_bom_parts_list_for_article.sql",
    "titleEn": "Bill of Materials (BOM) Parts List for Article",
    "category": "articles",
    "icon": "cpu",
    "description": "Component breakdown and bill of materials for repair kits and multi-component assemblies.",
    "tables": [
      "ARTICLES",
      "LINK_ART_PT",
      "ARTICLE_CRITERIA"
    ],
    "defaultParams": {
      "ART_ID": "1763276"
    },
    "sql": " SET @ART_ID = 1763276; /* HELLA 1EJ 004 440-121 */\r\n\r\n    SELECT \r\n          ARTICLES.ART_ARTICLE_NR,\r\n          get_text(KEY_VALUES.KV_DES_ID, @LNGID) AS ART_STATUS_TEXT, \r\n/*-- ---------------------------------------------------------------*/       \r\n         CONCAT_WS(' ',\r\n                    (SELECT\r\n                           GROUP_CONCAT( get_text(PRODUCTS.PT_DES_ID, @LNGID) SEPARATOR ',' )\r\n                     FROM\r\n                           LINK_ART_PT\r\n                           INNER JOIN PRODUCTS ON PRODUCTS.PT_ID = LINK_ART_PT.LAP_PT_ID\r\n                     WHERE\r\n                           LINK_ART_PT.LAP_ART_ID = ARTICLES.ART_ID), \r\n                           \r\n\t\t\t\t\t get_text(ARTICLES.ART_DES_ID, @LNGID) ) AS ART_PRODUCT_NAME,\r\n/*-- ---------------------------------------------------------------*/              \r\n          (SELECT\r\n                 GROUP_CONCAT( \r\n                              CONCAT_WS(': ', get_text(CRITERIA.CRI_SHORT_DES_ID, @LNGID), \r\n                                (CASE\r\n                                     WHEN CRITERIA.CRI_TYPE = 3 \r\n\t\t\t\t\t\t\t\t\t\t THEN \r\n                                           get_text_kt(ARTICLE_CRITERIA.ACR_KV_KT_ID, ARTICLE_CRITERIA.ACR_VALUE, @LNGID) \r\n                                     ELSE\r\n                                        ARTICLE_CRITERIA.ACR_VALUE\r\n                                END) )\r\n                 SEPARATOR '; ')\r\n          FROM\r\n                 ARTICLE_CRITERIA\r\n                 INNER JOIN CRITERIA ON ARTICLE_CRITERIA.ACR_CRI_ID = CRITERIA.CRI_ID\r\n          WHERE\r\n                 ARTICLE_CRITERIA.ACR_ART_ID = ARTICLES.ART_ID LIMIT 4 ) AS ARTICLE_CRITERIA,\r\n/*-- --------------------------------------------------------------- */\r\n                \r\n\t\tARTICLES_PART_LIST.APL_QUANTITY AS QUANTITY,\r\n        ARTICLES_PART_LIST.APL_SORT AS ORDER_IN_LIST\r\n        \r\n\tFROM\r\n             ARTICLES_PART_LIST\r\n             INNER JOIN ARTICLES ON ARTICLES.ART_ID = ARTICLES_PART_LIST.APL_ART_ID_COMPONENT\r\n        \r\n             INNER JOIN ART_COUNTRY_SPECIFICS ON ART_COUNTRY_SPECIFICS.ACS_ART_ID = ARTICLES.ART_ID\r\n                   AND (ART_COUNTRY_SPECIFICS.ACS_COU_ID = @COUNTRY_FILTER OR ART_COUNTRY_SPECIFICS.ACS_COU_ID = 0)\r\n        \r\n             LEFT OUTER JOIN KEY_VALUES ON KEY_VALUES.KV_KT_ID = 73\r\n                   AND KEY_VALUES.KV_KV = ART_COUNTRY_SPECIFICS.ACS_STATUS_KV_KV\r\n    WHERE\r\n             ARTICLES_PART_LIST.APL_ART_ID = @ART_ID"
  },
  {
    "id": "q_24",
    "filename": "database_storage_table_sizes.sql",
    "titleEn": "Database Storage Footprint (Table & Index Sizes)",
    "category": "admin",
    "icon": "database",
    "description": "Analyzes MySQL information_schema.tables and index sizes in Gigabytes.",
    "tables": [
      "information_schema.tables"
    ],
    "defaultParams": {},
    "sql": "SELECT table_name,(index_length/1048576) IndexGB\r\nFROM information_schema.tables\r\norder by IndexGB desc"
  },
  {
    "id": "q_25",
    "filename": "audit_unused_database_indexes.sql",
    "titleEn": "Unused MySQL Database Indexes Audit",
    "category": "admin",
    "icon": "alert-triangle",
    "description": "Audits database performance by finding unused index definitions across schemas.",
    "tables": [
      "information_schema.statistics",
      "information_schema.index_statistics"
    ],
    "defaultParams": {},
    "sql": "SELECT DISTINCT s.TABLE_SCHEMA, s.TABLE_NAME, s.INDEX_NAME\r\nFROM information_schema.statistics `s` LEFT JOIN information_schema.index_statistics INDXS\r\nON (s.TABLE_SCHEMA = INDXS.TABLE_SCHEMA AND\r\n   s.TABLE_NAME=INDXS.TABLE_NAME AND\r\n   s.INDEX_NAME=INDXS.INDEX_NAME)\r\nWHERE INDXS.TABLE_SCHEMA IS NULL;"
  },
  {
    "id": "q_26",
    "filename": "tecdoc2018_get_makes.sql",
    "titleEn": "TecDoc 2018: Multi-Type Vehicle Makes (Passenger, Commercial, Motorbike, Engine, Axle)",
    "category": "tecdoc2018",
    "icon": "car",
    "description": "Selects vehicle manufacturers filtered by vehicle category (ispassengercar, iscommercialvehicle, ismotorbike, isengine, isaxle) from the 2018 schema.",
    "tables": [
      "manufacturers"
    ],
    "defaultParams": {
      "TYPE": "passenger"
    },
    "sql": "-- TecDoc 2018 Legacy Schema: Select Makes by Vehicle Type\n-- Type options: passenger, commercial, motorbike, engine, axle\nSELECT id, description AS name, matchcode\nFROM manufacturers\nWHERE canbedisplayed = 'True'\n  AND ispassengercar = 'True'\nORDER BY matchcode ASC;"
  },
  {
    "id": "q_27",
    "filename": "tecdoc2018_get_models.sql",
    "titleEn": "TecDoc 2018: Model Series Lookup with Construction Intervals",
    "category": "tecdoc2018",
    "icon": "layers",
    "description": "Selects model ranges for a manufacturer including production intervals from the 2018 models table.",
    "tables": [
      "models"
    ],
    "defaultParams": {
      "MAKE_ID": "5"
    },
    "sql": "-- TecDoc 2018 Legacy Schema: Select Models by Manufacturer ID\n-- Reference: Audi (ID=5)\nSELECT id, description AS name, constructioninterval\nFROM models\nWHERE canbedisplayed = 'True'\n  AND manufacturerid = 5\n  AND ispassengercar = 'True'\nORDER BY description ASC;"
  },
  {
    "id": "q_28",
    "filename": "tecdoc2018_get_modifications.sql",
    "titleEn": "TecDoc 2018: Vehicle Modification & Full Technical Attributes",
    "category": "tecdoc2018",
    "icon": "sliders",
    "description": "Extracts vehicle modifications and EAV (Entity-Attribute-Value) specifications from passanger_cars and passanger_car_attributes.",
    "tables": [
      "passanger_cars",
      "passanger_car_attributes"
    ],
    "defaultParams": {
      "MODEL_ID": "5376"
    },
    "sql": "-- TecDoc 2018 Legacy Schema: Vehicle Modifications & Attributes\n-- Reference: Audi A4 8EC B7 (Model ID=5376)\nSELECT pc.id, pc.fulldescription AS name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue\nFROM passanger_cars pc \nLEFT JOIN passanger_car_attributes a ON pc.id = a.passangercarid\nWHERE pc.canbedisplayed = 'True'\n  AND pc.modelid = 5376\n  AND pc.ispassengercar = 'True'\nORDER BY pc.id, a.displaytitle;"
  },
  {
    "id": "q_29",
    "filename": "tecdoc2018_get_sections_tree.sql",
    "titleEn": "TecDoc 2018: Multi-Level Assembly Category Tree (havechild Traversal)",
    "category": "tecdoc2018",
    "icon": "folder-tree",
    "description": "Builds the recursive product category tree for a vehicle with dynamic havechild lookahead subqueries.",
    "tables": [
      "passanger_car_trees"
    ],
    "defaultParams": {
      "CAR_ID": "18371",
      "PARENT_ID": "0"
    },
    "sql": "-- TecDoc 2018 Legacy Schema: Category Assembly Tree with havechild Lookahead\n-- Reference: Audi A4 2.0 TFSI (ID=18371), Root Parent=0\nSELECT id, description,\n       IF(EXISTS(SELECT 1 FROM passanger_car_trees t1 \n                 INNER JOIN passanger_car_trees t2 ON t1.parentid = t2.id \n                 WHERE t2.parentid = 0 AND t1.passangercarid = 18371 LIMIT 1), 1, 0) AS havechild\nFROM passanger_car_trees\nWHERE passangercarid = 18371 AND parentId = 0\nORDER BY havechild DESC, description ASC;"
  },
  {
    "id": "q_30",
    "filename": "tecdoc2018_get_section_parts.sql",
    "titleEn": "TecDoc 2018: Section Parts by Linkage ID & Node ID",
    "category": "tecdoc2018",
    "icon": "package",
    "description": "Finds all replacement parts linked to a specific assembly section node for a vehicle modification.",
    "tables": [
      "article_links",
      "passanger_car_pds",
      "passanger_car_prd",
      "suppliers"
    ],
    "defaultParams": {
      "CAR_ID": "18371",
      "NODE_ID": "100006"
    },
    "sql": "-- TecDoc 2018 Legacy Schema: Parts linked to Brake System (Node ID=100006)\nSELECT al.datasupplierarticlenumber AS part_number, \n       s.description AS supplier_name, \n       prd.description AS product_name\nFROM article_links al \nJOIN passanger_car_pds pds ON al.supplierid = pds.supplierid\nJOIN suppliers s ON s.id = al.supplierid\nJOIN passanger_car_prd prd ON prd.id = al.productid\nWHERE al.productid = pds.productid\n  AND al.linkageid = pds.passangercarid\n  AND al.linkageid = 18371\n  AND pds.nodeid = 100006\n  AND al.linkagetypeid = 2\nORDER BY s.description, al.datasupplierarticlenumber;"
  },
  {
    "id": "q_31",
    "filename": "tecdoc2018_get_oem_numbers.sql",
    "titleEn": "TecDoc 2018: Original Equipment Manufacturer OE Numbers",
    "category": "tecdoc2018",
    "icon": "hash",
    "description": "Queries original car manufacturer OE part numbers (article_oe) for a given supplier article.",
    "tables": [
      "article_oe",
      "manufacturers"
    ],
    "defaultParams": {
      "PART_NUM": "20430",
      "SUPPLIER_ID": "21"
    },
    "sql": "-- TecDoc 2018 Legacy Schema: OE Numbers for FEBI BILSTEIN 20430\nSELECT m.description AS manufacturer, a.OENbr AS oe_number\nFROM article_oe a \nJOIN manufacturers m ON m.id = a.manufacturerId \nWHERE a.datasupplierarticlenumber = '20430' \n  AND a.supplierid = '21'\nORDER BY m.description;"
  },
  {
    "id": "q_32",
    "filename": "tecdoc2018_get_art_status.sql",
    "titleEn": "TecDoc 2018: Article Status & Lifecycle State",
    "category": "tecdoc2018",
    "icon": "check-circle",
    "description": "Retrieves normalized product description and lifecycle state display value.",
    "tables": [
      "articles"
    ],
    "defaultParams": {
      "PART_NUM": "20430",
      "SUPPLIER_ID": "21"
    },
    "sql": "-- TecDoc 2018 Legacy Schema: Article Lifecycle State\nSELECT NormalizedDescription, ArticleStateDisplayValue\nFROM articles\nWHERE DataSupplierArticleNumber = '20430' \n  AND supplierId = '21';"
  },
  {
    "id": "q_33",
    "filename": "tecdoc2018_get_art_attributes.sql",
    "titleEn": "TecDoc 2018: Article Technical Specifications & Information Types",
    "category": "tecdoc2018",
    "icon": "sliders",
    "description": "Selects technical parameters, dimensions, and attribute information types for an article.",
    "tables": [
      "article_attributes"
    ],
    "defaultParams": {
      "PART_NUM": "20430",
      "SUPPLIER_ID": "21"
    },
    "sql": "-- TecDoc 2018 Legacy Schema: Article Technical Criteria Attributes\nSELECT attributeinformationtype, displaytitle, displayvalue\nFROM article_attributes\nWHERE datasupplierarticlenumber = '20430'  \n  AND supplierid = '21'\nORDER BY displaytitle;"
  },
  {
    "id": "q_34",
    "filename": "tecdoc2018_get_art_cross.sql",
    "titleEn": "TecDoc 2018: Article Cross References & Aftermarket Analogs",
    "category": "tecdoc2018",
    "icon": "repeat",
    "description": "Discovers aftermarket cross-reference analogs linked via common OE numbers.",
    "tables": [
      "article_oe",
      "article_cross",
      "suppliers",
      "manufacturers"
    ],
    "defaultParams": {
      "PART_NUM": "20430",
      "SUPPLIER_ID": "21"
    },
    "sql": "-- TecDoc 2018 Legacy Schema: Aftermarket Cross-Reference Interchange\nSELECT DISTINCT s.description AS cross_brand, c.PartsDataSupplierArticleNumber AS cross_part_number, a.OENbr AS common_oe\nFROM article_oe a \nJOIN manufacturers m ON m.id = a.manufacturerId \nJOIN article_cross c ON c.OENbr = a.OENbr\nJOIN suppliers s ON s.id = c.SupplierId\nWHERE a.datasupplierarticlenumber = '20430' \n  AND a.supplierid = '21'\nORDER BY s.description;"
  },
  {
    "id": "q_35",
    "filename": "tecdoc2018_get_art_parts.sql",
    "titleEn": "TecDoc 2018: Bill of Materials & Set Components (article_parts)",
    "category": "tecdoc2018",
    "icon": "grid",
    "description": "Selects constituent components and quantities making up a composite assembly kit.",
    "tables": [
      "article_parts",
      "suppliers"
    ],
    "defaultParams": {
      "PART_NUM": "1763276",
      "SUPPLIER_ID": "21"
    },
    "sql": "-- TecDoc 2018 Legacy Schema: Bill of Materials Kit Breakdown\nSELECT DISTINCT s.description AS brand, Quantity AS quantity, PartsDataSupplierArticleNumber AS component_number\nFROM article_parts ap\nJOIN suppliers s ON s.id = ap.PartsSupplierId\nWHERE DataSupplierArticleNumber = '1763276' \n  AND supplierId = '21'\nORDER BY component_number;"
  },
  {
    "id": "q_36",
    "filename": "tecdoc2017_cr_herst_new.sql",
    "titleEn": "TecDoc 2017: Manufacturer Release Deltas (cr_herst_new)",
    "category": "tecdoc2017",
    "icon": "plus-circle",
    "description": "Selects newly introduced vehicle, commercial, and aftermarket component brands from the 2017 change request delta tables.",
    "tables": [
      "cr_herst_new"
    ],
    "defaultParams": {},
    "sql": "-- TecDoc 2017 Change Request (CR) Delta: New Manufacturers\n-- Tracks official vendor introductions across 2017 release packages\nSELECT VehManNo AS vehicle_man_no, \n       Description AS manufacturer_name, \n       ShortDescr AS short_code, \n       Brand AS brand_trading_name\nFROM cr_herst_new\nORDER BY VehManNo ASC;"
  },
  {
    "id": "q_37",
    "filename": "tecdoc2017_cr_mod_new.sql",
    "titleEn": "TecDoc 2017: Model Series Lifecycle & Range Revisions (cr_mod_new)",
    "category": "tecdoc2017",
    "icon": "layers",
    "description": "Queries new vehicle model line registrations and revisions from the 2017 delta specifications.",
    "tables": [
      "cr_mod_new",
      "cr_herst_new"
    ],
    "defaultParams": {},
    "sql": "-- TecDoc 2017 CR Delta: New Model Lines & Construction Periods\nSELECT cm.ModelId AS model_id, \n       cm.Description AS model_name, \n       cm.VehManNo AS manufacturer_id, \n       cm.DateFrom AS production_start, \n       cm.DateTo AS production_end\nFROM cr_mod_new cm\nORDER BY cm.ModelId ASC;"
  },
  {
    "id": "q_38",
    "filename": "tecdoc2017_cr_fzg_new.sql",
    "titleEn": "TecDoc 2017: Vehicle Additions & Displacement Deltas (cr_fzg_new)",
    "category": "tecdoc2017",
    "icon": "car",
    "description": "Inspects new vehicle engine trim variations (K-Typ) with horsepower, kilowatt, and cubic capacity metrics.",
    "tables": [
      "cr_fzg_new"
    ],
    "defaultParams": {},
    "sql": "-- TecDoc 2017 CR Delta: Vehicle Additions (Fahrzeuge Neu)\n-- Tracks newly added vehicle configurations with technical displacements\nSELECT VehicleId AS k_type_id, \n       Description AS vehicle_trim, \n       PowerKw AS power_kw, \n       PowerHp AS power_hp, \n       CubicCapacity AS displacement_ccm, \n       DateFrom AS production_start\nFROM cr_fzg_new\nORDER BY VehicleId ASC;"
  },
  {
    "id": "q_39",
    "filename": "tecdoc2017_cr_mcode_new.sql",
    "titleEn": "TecDoc 2017: Engine Code Registrations (cr_mcode_new)",
    "category": "tecdoc2017",
    "icon": "cpu",
    "description": "Audits newly registered engine codes (Motorcodes) with displacement, valve configurations, and fuel types.",
    "tables": [
      "cr_mcode_new"
    ],
    "defaultParams": {},
    "sql": "-- TecDoc 2017 CR Delta: Engine Code Registry (Motorcodes)\nSELECT EngineId AS engine_id, \n       EngineCode AS motor_code, \n       DisplacementCcm AS displacement_cc, \n       FuelType AS fuel_type, \n       ManufacturerId AS manufacturer_id\nFROM cr_mcode_new\nORDER BY EngineId ASC;"
  },
  {
    "id": "q_40",
    "filename": "tecdoc2017_cr_genart_cng.sql",
    "titleEn": "TecDoc 2017: Generic Article & Mandatory Criteria Rules (cr_genart_cng)",
    "category": "tecdoc2017",
    "icon": "package",
    "description": "Tracks generic article taxonomy criteria requirement changes (SA210 and SA400 criteria mandatory flags).",
    "tables": [
      "cr_genart_cng"
    ],
    "defaultParams": {},
    "sql": "-- TecDoc 2017 CR Delta: Generic Article Criteria Requirement Rules\nSELECT GenArtNo AS generic_article_id, \n       MasterDescription AS master_description, \n       AssemblyGroup AS assembly_group, \n       CriterionOld AS old_criterion, \n       CriterionNew AS new_criterion, \n       MandatoryFlag AS is_mandatory\nFROM cr_genart_cng\nORDER BY GenArtNo ASC;"
  },
  {
    "id": "q_41",
    "filename": "tecdoc2017_cr_achse_new.sql",
    "titleEn": "TecDoc 2017: Commercial Trailer & Drive Axles (cr_achse_new)",
    "category": "tecdoc2017",
    "icon": "disc",
    "description": "Queries newly registered heavy-duty trailer and drive axles from Dana, Spicer, and SAF-Holland.",
    "tables": [
      "cr_achse_new"
    ],
    "defaultParams": {},
    "sql": "-- TecDoc 2017 CR Delta: New Commercial Trailer & Drive Axles\nSELECT AxleTypeNo AS axle_type_no, \n       ManDescription AS manufacturer, \n       ModelSeriesDescription AS series_name, \n       AxleType AS axle_type, \n       YearFrom AS my_from\nFROM cr_achse_new\nORDER BY AxleTypeNo ASC;"
  },
  {
    "id": "q_42",
    "filename": "tecdoc2017_cr_fzglndspez_new.sql",
    "titleEn": "TecDoc 2017: Country-Specific Vehicle Configurations (cr_fzglndspez_new)",
    "category": "tecdoc2017",
    "icon": "globe",
    "description": "Queries regional market restrictions and country-specific configuration deltas for European and global markets.",
    "tables": [
      "cr_fzglndspez_new"
    ],
    "defaultParams": {},
    "sql": "-- TecDoc 2017 CR Delta: Country-Specific Vehicle Market Configurations\nSELECT VehicleId AS vehicle_id, \n       CountryCode AS country_iso, \n       RestrictionType AS restriction_type, \n       Description AS market_description\nFROM cr_fzglndspez_new\nORDER BY VehicleId ASC;"
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Queries (42)', icon: 'grid' },
  { id: 'vehicles', name: 'Vehicles & Models', icon: 'car' },
  { id: 'tecdoc2018', name: 'TecDoc 2018 Schema & API (10)', icon: 'archive' },
  { id: 'tecdoc2017', name: 'TecDoc 2017 Change Deltas (7)', icon: 'git-commit' },
  { id: 'plates', name: 'License Plates & Reg', icon: 'hash' },
  { id: 'trees', name: 'Product Groups & Tree', icon: 'folder-tree' },
  { id: 'articles', name: 'Articles & BOM Details', icon: 'package' },
  { id: 'crosses', name: 'Crosses & Schematics', icon: 'repeat' },
  { id: 'admin', name: 'Database Diagnostics', icon: 'database' }
];

export const LANGUAGES = [
  { id: '4', code: 'EN', name: 'English (EN)' },
  { id: '1', code: 'DE', name: 'German (DE)' },
  { id: '6', code: 'FR', name: 'French (FR)' },
  { id: '7', code: 'IT', name: 'Italian (IT)' },
  { id: '8', code: 'ES', name: 'Spanish (ES)' },
  { id: '16', code: 'RU', name: 'Russian (RU)' },
  { id: '14', code: 'PL', name: 'Polish (PL)' },
  { id: '17', code: 'TR', name: 'Turkish (TR)' }
];


