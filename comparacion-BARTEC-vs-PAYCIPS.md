# Comparación: `BARTEC_file.txt` vs `PAYCIPS_file.txt`

Análisis asumiendo **una fila = una línea** en el editor. Se indica el número de línea en **cada archivo** cuando difieren.

---

## 1. Metadatos del procedimiento almacenado

| Aspecto | BARTEC (línea) | PAYCIPS (línea) |
|---------|----------------|-----------------|
| Comentario `Object: StoredProcedure` (nombre, fecha/hora del script) | **3** | **3** |
| `ALTER PROCEDURE` | **8** — `[dbo].[BARTEC_APP_USUARIO_SUP]` | **8** — `[dbo].[PAYCIPS_APP_USUARIO_SUP]` |

---

## 2. Membresía y comercio (`JOIN` a NetMembership)

- **BARTEC 80–83**: `NetMembershipAPPDB..APLIC_USUARIO_D`, `NetMembershipAPPDB..USUARIO_COMERCIO_D`, `NetMembershipAPPDB..COMERCIO`.
- **PAYCIPS 80–83**: `NetMembership..APLIC_USUARIO_D`, `NetMembership..USUARIO_COMERCIO_D`, `NetMembership..COMERCIO` (sin sufijo `APPDB`).

También cambia el sangrado/espaciado de la condición `AND` en el `JOIN` con `USUARIO_COMERCIO_D` (**82–83** en ambos, contenido distinto).

---

## 3. CLABE

- **BARTEC 92–100**: `@CLABE` desde `InveraterDBC..PORTAFOLIO` (`CTECTA`), con filtros `PORTAFOLIOID`, `CTEID`, `EXPID`, `TIPOSALDOID`, `ID_MONEDA`, `ID_NUM_TIPOSERVICIO = 2`.
- **PAYCIPS 92–94**: `@CLABE` desde `eHubDB..COMERCIO_CLABE` (`CLABE`), `WHERE ID_NUM_COMERCIO = @ID_CTECORP`.

---

## 4. CIE

- **BARTEC 101–108**: `@CIE` desde `InveraterDBC..PORTAFOLIO` (`CTECTA`) con `ID_NUM_TIPOSERVICIO = 3` y mismos criterios de cartera que CLABE.
- **PAYCIPS 96–100**: `SELECT TOP 1 @CIE = REFCIEBANCOMER` desde `eHubDB..COMERCIO_TERM` unido a `eHubDB..SALDOCOM_FLO` (emparejo por teléfono/cuenta flotante y `ID_NUM_TIPOFLO = 1`).

---

## 5. Tarjeta (PAN, vencimiento, tipo, estatus)

- **BARTEC 120–129**: consulta real de tarjeta **comentada**.
- **BARTEC 131–136**: `@CUENTAID` fijo `1223654` y `SELECT` con valores literales (PAN, fecha, “Tarjeta PayCIPS”, “ACTIVA”).

- **PAYCIPS 112**: `@CUENTAID` desde `eHubDB..EMISION_COMCTA` por `ID_NUM_COMERCIO`.
- **PAYCIPS 114–121**: `SELECT` **activo** sobre `eHubDB..TARJETAPRIVADA` y catálogos de tipo y estatus.
- **PAYCIPS 123–126**: el bloque equivalente a valores fijos va **comentado**.

Los comentarios JSON de “Servicios” son el mismo bloque conceptual pero **desplazados** (BARTEC ~**138** en adelante; PAYCIPS ~**128** en adelante) por la diferencia de líneas del bloque de tarjeta.

---

## 6. Catálogo de servicios

- **BARTEC 168**: `SELECT * FROM InveraterDBC..SERVICIO`
- **PAYCIPS 158**: `SELECT * FROM PayCIPSDB..SERVICIO`

---

## 7. Comentarios de permisos (`------use ...`)

- **BARTEC 227**: `------use InveraterDBC`
- **PAYCIPS 217**: `------use eHubDB`

Los `grant` comentados alinean el esquema con **InveraterDBC** (BARTEC) vs **eHubDB** (PAYCIPS) en ese bloque.

---

## 8. Inserciones en `#TMPSALIDASPEIXDIA`

### 8.1 Movimientos SPEI recibidos

- **BARTEC 261–276**: columna de folio `STPRECFOLIO`, tabla `InveraterDBC..mov_stpspeirec`, filtro `CTEID = @ID_CTECORP`.
- **PAYCIPS 251–267**: folio `IDS_NUM_FOLIO`, tabla `eHubDB..mov_stpspeirec`, filtro `ID_NUM_COMERCIO = @ID_CTECORP`; comentario de rango de fechas en **266**.

### 8.2 Movimientos SPEI enviados

- **BARTEC 278–295**: `STPENVFOLIO`, `InveraterDBC..MOV_STPSPEIENV`, `CTEID`; comentario de fechas fijas en **294**.
- **PAYCIPS 269–286**: `IDS_NUM_FOLIO`, `eHubDB..MOV_STPSPEIENV`, `ID_NUM_COMERCIO`; comentario de fechas en **285**.

### 8.3 Tercer `INSERT` (tipo 2 y datos reales vs placeholder)

- **BARTEC 297–312**: filas “vacías” con `FOLIO = 0`, `TIPO = 2`, `FROM InveraterDBC..MOV_STPSPEIENV WHERE 0=1` (no inserta filas reales).
- **PAYCIPS 288–307**: datos reales desde `eHubDB..FONDOLIQOP_TRANSF` con `JOIN eHubDB..SALDOCOM_FLO`, columnas operativas (`ID_NUM_TRFLO`, `FECHA`, `NOM_BENEF`, importes, estatus, etc.) y filtro por comercio y fechas.

---

## 9. Consulta con descripción de institución

- **BARTEC 315–319**: `JOIN InveraterDBC..INSTFIN`
- **PAYCIPS 310–314**: `JOIN eHubDB..INSTFIN`

---

## 10. Saldo

- **BARTEC 322–327**: `InveraterDBC..SALDOCTE` — `CTEID`, `TIPOSALDOID = 1`, `PORTAFOLIOID = 0`, `ID_MONEDA = 1`.
- **PAYCIPS 317–320**: `eHubDB..SALDOCOM_FLO` — `ID_NUM_COMERCIO`, `ID_NUM_TIPOFLO = 2`.

---

## 11. Listado de instituciones finales

- **BARTEC 347–353**: `FROM InveraterDBC..INSTFIN`
- **PAYCIPS 340–346**: `FROM eHubDB..INSTFIN`

---

## 12. Longitud del archivo

- **BARTEC**: archivo hasta aproximadamente la **línea 355** (incluye líneas en blanco al final).
- **PAYCIPS**: archivo hasta la **línea 348**.

A partir del bloque de CLABE/CIE/tarjeta, muchas diferencias **desalinean** el número de línea entre archivos aunque secciones posteriores sean conceptualmente paralelas.

---

## Resumen ejecutivo

| Área | BARTEC | PAYCIPS |
|------|--------|---------|
| Nombre del SP | `BARTEC_APP_USUARIO_SUP` | `PAYCIPS_APP_USUARIO_SUP` |
| Membresía | `NetMembershipAPPDB` | `NetMembership` |
| CLABE / CIE | `InveraterDBC..PORTAFOLIO` | `eHubDB..COMERCIO_CLABE`, `COMERCIO_TERM` + `SALDOCOM_FLO` |
| Tarjeta | Valores fijos + consulta comentada | Consulta activa en `eHubDB` |
| Servicios | `InveraterDBC..SERVICIO` | `PayCIPSDB..SERVICIO` |
| SPEI / tipo 2 | Placeholder `WHERE 0=1` | `FONDOLIQOP_TRANSF` real |
| Saldo / INSTFIN | `InveraterDBC` | `eHubDB` |

---

*Generado a partir del contenido de `BARTEC_file.txt` y `PAYCIPS_file.txt` en el repositorio.*
