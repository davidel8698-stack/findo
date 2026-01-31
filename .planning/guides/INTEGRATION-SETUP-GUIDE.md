# הדרכה מפורטת: הגדרת WhatsApp Business API + Google Business Profile API

> **עודכן:** ינואר 2026
> **זמן משוער:** 2-3 שעות עבודה + זמן המתנה לאישורים

---

## תוכן עניינים

1. [חלק א': WhatsApp Business API](#חלק-א-whatsapp-business-api)
2. [חלק ב': Google Business Profile API](#חלק-ב-google-business-profile-api)
3. [חלק ג': סיכום ה-Credentials](#חלק-ג-סיכום-ה-credentials)

---

# חלק א': WhatsApp Business API

## מה נשיג בסוף?

| משתנה | תיאור |
|-------|-------|
| `META_APP_ID` | מזהה האפליקציה שלך |
| `META_APP_SECRET` | הסוד של האפליקציה |
| `META_CONFIG_ID` | מזהה הקונפיגורציה ל-Embedded Signup |

---

## שלב 1: יצירת חשבון Meta Business

### 1.1 כניסה ל-Meta Business Suite

1. פתח את הדפדפן ועבור לכתובת:
   ```
   https://business.facebook.com
   ```

2. אם יש לך חשבון פייסבוק אישי - התחבר איתו
3. אם אין - צור חשבון פייסבוק חדש קודם

### 1.2 יצירת Business Account

1. לאחר הכניסה, לחץ על **"צור חשבון עסקי"** (Create a Business Account)
2. הזן את הפרטים:
   - **שם העסק:** Findo (או השם שלך)
   - **שם מלא שלך:** השם שלך
   - **אימייל עסקי:** האימייל שלך
3. לחץ **"שלח"** (Submit)

### 1.3 אימות העסק (Business Verification)

> **חשוב:** בלי אימות לא תוכל להשתמש ב-WhatsApp API בצורה מלאה

1. בתפריט השמאלי, לחץ על **"הגדרות"** (Settings)
2. בחר **"מרכז אבטחה"** (Security Center)
3. לחץ על **"התחל אימות"** (Start Verification)

#### מסמכים שתצטרך להעלות (אחד מהבאים):

| סוג מסמך | דוגמאות |
|----------|---------|
| רישום עסק רשמי | תעודת עוסק מורשה, רישום חברה ברשם החברות |
| חשבון שירות | חשבון חשמל/מים/ארנונה על שם העסק |
| דף עסק בנק | דף חשבון בנק עם שם וכתובת העסק |
| החזר מס | טופס מס הכנסה או מע"מ |

#### דרישות למסמך:
- חייב להכיל את **שם העסק** בדיוק כפי שהזנת
- חייב להכיל **כתובת העסק**
- חייב להיות **קריא וברור**
- פורמט: PDF, JPG או PNG

4. העלה את המסמך ולחץ **"שלח לבדיקה"**
5. **זמן המתנה:** 1-3 ימי עסקים (לפעמים עד 14 יום)

---

## שלב 2: יצירת אפליקציה ב-Meta for Developers

### 2.1 כניסה ל-Meta for Developers

1. פתח את הדפדפן ועבור ל:
   ```
   https://developers.facebook.com
   ```

2. לחץ על **"Log In"** בפינה הימנית העליונה
3. התחבר עם אותו חשבון פייסבוק מקודם
4. אם זו הפעם הראשונה - תצטרך לאשר תנאי שימוש

### 2.2 יצירת אפליקציה חדשה

1. לחץ על **"My Apps"** בתפריט העליון
2. לחץ על הכפתור הירוק **"Create App"**

### 2.3 בחירת סוג האפליקציה

1. יופיע מסך "What do you want your app to do?"
2. בחר **"Other"** (אחר)
3. לחץ **"Next"**

### 2.4 בחירת סוג האפליקציה (שלב 2)

1. יופיע מסך "Select an app type"
2. בחר **"Business"** (עסקי)
3. לחץ **"Next"**

### 2.5 פרטי האפליקציה

1. הזן את הפרטים:
   - **App name:** `Findo WhatsApp Integration`
   - **App contact email:** האימייל שלך
   - **Business Account:** בחר את החשבון העסקי שיצרת בשלב 1

2. לחץ **"Create App"**
3. ייתכן שתתבקש להזין סיסמה שוב - הזן אותה

### 2.6 שמור את ה-App ID

1. ברגע שהאפליקציה נוצרה, תראה את **App ID** בחלק העליון של המסך
2. **שמור אותו!** זה ה-`META_APP_ID` שלך

   ```
   META_APP_ID=123456789012345
   ```

---

## שלב 3: הוספת WhatsApp למוצרי האפליקציה

### 3.1 הוספת WhatsApp Product

1. בתפריט השמאלי של האפליקציה, גלול למטה
2. מצא את הקטע **"Add a Product"**
3. חפש **"WhatsApp"** ולחץ **"Set Up"**

### 3.2 חיבור לחשבון עסקי

1. יופיע מסך "Getting Started"
2. תחת **"Select a Meta Business Account"** - בחר את החשבון העסקי שלך
3. לחץ **"Continue"**

### 3.3 הגדרות ראשוניות

1. תראה עמוד עם:
   - **Temporary access token** (טוקן זמני - מתוקף ל-24 שעות)
   - **Phone number ID**
   - **WhatsApp Business Account ID**

2. **אל תשתמש בטוקן הזמני!** נייצר טוקן קבוע בהמשך

---

## שלב 4: קבלת ה-App Secret

### 4.1 גישה להגדרות האפליקציה

1. בתפריט השמאלי, לחץ על **"Settings"** (הגדרות)
2. בחר **"Basic"** (בסיסי)

### 4.2 שמירת ה-App Secret

1. תראה שדה בשם **"App Secret"**
2. לחץ על **"Show"** (הצג)
3. תתבקש להזין סיסמה - הזן אותה
4. **העתק ושמור את ה-Secret!**

   ```
   META_APP_SECRET=abcdef1234567890abcdef1234567890
   ```

> **אזהרה:** אל תשתף את ה-App Secret עם אף אחד! זה כמו סיסמה.

---

## שלב 5: הגדרת Embedded Signup Configuration

### 5.1 גישה להגדרות Facebook Login for Business

1. בתפריט השמאלי, לחץ על **"Facebook Login for Business"**
   - אם לא קיים, לחץ על "Add Product" והוסף אותו
2. לחץ על **"Configurations"**

### 5.2 יצירת Configuration חדש

1. לחץ על **"Create configuration"**
2. הזן שם: `Findo Embedded Signup`
3. לחץ **"Next"**

### 5.3 בחירת Login Variation

1. במסך "Login variation" - בחר **"WhatsApp Embedded Signup"**
2. לחץ **"Next"**

### 5.4 בחירת Products

1. במסך "Products" - סמן:
   - [x] **WhatsApp Cloud API**
   - [x] **Marketing Messages API for WhatsApp**
2. לחץ **"Next"**

### 5.5 הגדרת Token Expiration

1. במסך "Access token" - תחת "Choose token expiration":
   - בחר **"Never"** (לעולם לא פג תוקף)
2. לחץ **"Next"**

### 5.6 הגדרת Permissions

1. במסך "Assets" - סמן את ההרשאות:
   - [x] **whatsapp_business_management**
   - [x] **whatsapp_business_messaging**
2. לחץ **"Create"**

### 5.7 שמירת Configuration ID

1. לאחר היצירה, תראה **Configuration ID**
2. **העתק ושמור אותו!**

   ```
   META_CONFIG_ID=987654321098765
   ```

---

## שלב 6: הגדרת אמצעי תשלום

> **חשוב:** בלי אמצעי תשלום לא תוכל לשלוח הודעות WhatsApp

### 6.1 גישה להגדרות תשלום

1. עבור ל-Meta Business Suite:
   ```
   https://business.facebook.com
   ```
2. בתפריט השמאלי: **"Settings"** → **"Billing and payments"**

### 6.2 הוספת אמצעי תשלום

1. לחץ **"Add Payment Method"**
2. בחר את המדינה: **Israel**
3. בחר מטבע: **ILS** או **USD**
4. הזן פרטי כרטיס אשראי
5. לחץ **"Save"**

### 6.3 תמחור (נכון ל-2026)

| סוג הודעה | עלות משוערת |
|-----------|-------------|
| Marketing | ~$0.05-0.08 להודעה |
| Utility | ~$0.02-0.04 להודעה |
| Authentication | ~$0.03-0.05 להודעה |
| Service (תגובה ב-24 שעות) | **חינם** |

---

## שלב 7: העברת האפליקציה ל-Live Mode

### 7.1 בדיקות לפני העלאה

1. חזור ל-Meta for Developers
2. בתפריט השמאלי: **"App Review"** → **"Permissions and Features"**
3. ודא שיש לך:
   - [x] Business Verification - מאושר
   - [x] אמצעי תשלום מוגדר

### 7.2 הגדרות Privacy Policy

1. לחץ על **"Settings"** → **"Basic"**
2. הזן **Privacy Policy URL** - כתובת מדיניות הפרטיות של Findo
   - לדוגמה: `https://findo.co.il/privacy`
3. הזן **Terms of Service URL** - כתובת תנאי השימוש
   - לדוגמה: `https://findo.co.il/terms`

### 7.3 העברה ל-Live

1. בראש הדף תראה: **"App Mode: Development"**
2. לחץ על ה-Toggle להעביר ל-**"Live"**
3. אשר את השינוי

---

# חלק ב': Google Business Profile API

## מה נשיג בסוף?

| משתנה | תיאור |
|-------|-------|
| `GOOGLE_CLIENT_ID` | מזהה הלקוח OAuth |
| `GOOGLE_CLIENT_SECRET` | הסוד של OAuth |
| `GOOGLE_REDIRECT_URI` | כתובת ה-Callback |

---

## שלב 1: יצירת פרויקט ב-Google Cloud Console

### 1.1 כניסה ל-Google Cloud Console

1. פתח את הדפדפן ועבור ל:
   ```
   https://console.cloud.google.com
   ```

2. התחבר עם חשבון Google (Gmail)
3. אם זו הפעם הראשונה - אשר את תנאי השימוש

### 1.2 יצירת פרויקט חדש

1. בראש הדף, ליד הלוגו של Google Cloud, יש dropdown של פרויקטים
2. לחץ עליו ובחר **"New Project"**
3. הזן את הפרטים:
   - **Project name:** `Findo`
   - **Organization:** (השאר ריק אם אין)
   - **Location:** (השאר ריק אם אין)
4. לחץ **"Create"**
5. המתן מספר שניות ליצירת הפרויקט

### 1.3 בחירת הפרויקט

1. ודא שהפרויקט `Findo` נבחר ב-dropdown העליון

---

## שלב 2: הגשת בקשה לגישה ל-API

> **חשוב מאוד:** ה-API של Google Business Profile דורש אישור ידני מ-Google!

### 2.1 דרישות מקדימות

לפני שתגיש בקשה, ודא שיש לך:

1. **פרופיל Google Business מאומת ופעיל** - לפחות 60 יום
2. **אתר אינטרנט** שמייצג את העסק
3. **מספר הפרויקט** (Project Number) מ-Google Cloud Console

### 2.2 מציאת מספר הפרויקט

1. ב-Google Cloud Console, לחץ על **"Dashboard"** בתפריט השמאלי
2. תראה כרטיס **"Project info"**
3. שם את **"Project number"** - זה מספר (לא ה-Project ID)
4. **שמור את המספר!** תצטרך אותו לטופס

### 2.3 מילוי טופס הבקשה

1. פתח את הקישור הבא:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSfC_FKSWzbSae_5rOpgwFeIUzXUF1JCQnlsZM_gC1I2UHjA3w/viewform
   ```

2. מלא את הטופס:

   | שדה | מה להזין |
   |-----|----------|
   | Company name | Findo |
   | Company website | https://findo.co.il |
   | Project Number | המספר מהשלב הקודם |
   | Contact email | האימייל שלך (חייב להיות Owner/Manager בפרופיל העסקי) |
   | Use case description | תאר את השימוש ב-API |

3. **תיאור Use Case לדוגמה:**

   ```
   Findo is a SaaS platform for small businesses in Israel.
   We help business owners manage their Google Business Profile automatically.

   We need the API to:
   1. Fetch and respond to customer reviews on behalf of business owners
   2. Post photos and updates to their business profiles
   3. Monitor business performance metrics
   4. Update business hours (including holidays)

   Each business owner will authorize Findo via OAuth to manage their own profile.
   We expect to manage profiles for approximately 100-500 businesses in the first year.
   ```

4. לחץ **"Submit"**

### 2.4 זמן המתנה

- **זמן טיפוסי:** 1-2 שבועות
- תקבל אימייל כשהבקשה תאושר
- אם נדחית - תקבל הסבר ותוכל להגיש שוב

### 2.5 בדיקת סטטוס האישור

1. ב-Google Cloud Console, לחץ על **"APIs & Services"** → **"Enabled APIs & services"**
2. לחץ על **"+ ENABLE APIS AND SERVICES"**
3. חפש **"Google My Business API"**
4. אם אתה רואה את ה-API - הבקשה אושרה!
5. אם לא רואה אותו - עדיין ממתין לאישור

---

## שלב 3: הפעלת ה-APIs (לאחר אישור)

### 3.1 הפעלת כל ה-APIs הנדרשים

לאחר שהבקשה אושרה, הפעל את כל ה-APIs הבאים:

1. לחץ על **"APIs & Services"** → **"Library"**
2. חפש והפעל כל אחד מהבאים:

| API | לחפש | ללחוץ |
|-----|------|-------|
| 1 | Google My Business API | Enable |
| 2 | My Business Account Management API | Enable |
| 3 | My Business Business Information API | Enable |
| 4 | My Business Verifications API | Enable |
| 5 | My Business Notifications API | Enable |
| 6 | My Business Place Actions API | Enable |
| 7 | My Business Q&A API | Enable |
| 8 | My Business Lodging API | Enable |

---

## שלב 4: הגדרת OAuth Consent Screen

### 4.1 גישה להגדרות OAuth

1. בתפריט השמאלי: **"APIs & Services"** → **"OAuth consent screen"**

### 4.2 בחירת User Type

1. בחר **"External"** (משתמשים חיצוניים)
2. לחץ **"Create"**

### 4.3 מילוי פרטי האפליקציה

**מסך 1 - App information:**

| שדה | מה להזין |
|-----|----------|
| App name | Findo |
| User support email | האימייל שלך |
| App logo | (אופציונלי) העלה לוגו של Findo |

**Developer contact information:**

| שדה | מה להזין |
|-----|----------|
| Email addresses | האימייל שלך |

לחץ **"Save and Continue"**

### 4.4 הגדרת Scopes

**מסך 2 - Scopes:**

1. לחץ **"Add or Remove Scopes"**
2. חפש והוסף את ה-Scope הבא:
   ```
   https://www.googleapis.com/auth/business.manage
   ```
3. סמן את ה-checkbox שלו
4. לחץ **"Update"**
5. לחץ **"Save and Continue"**

### 4.5 הוספת Test Users

**מסך 3 - Test users:**

1. לחץ **"Add Users"**
2. הזן את האימייל שלך (לבדיקות)
3. לחץ **"Add"**
4. לחץ **"Save and Continue"**

### 4.6 סיכום

**מסך 4 - Summary:**

1. בדוק שהכל נכון
2. לחץ **"Back to Dashboard"**

---

## שלב 5: יצירת OAuth Credentials

### 5.1 יצירת Client ID

1. בתפריט השמאלי: **"APIs & Services"** → **"Credentials"**
2. לחץ **"+ Create Credentials"**
3. בחר **"OAuth client ID"**

### 5.2 הגדרת ה-Client

| שדה | מה להזין |
|-----|----------|
| Application type | **Web application** |
| Name | `Findo OAuth Client` |

### 5.3 הגדרת Redirect URIs

1. תחת **"Authorized redirect URIs"** לחץ **"+ Add URI"**
2. הזן את ה-URI:
   ```
   https://your-domain.com/auth/google/callback
   ```

   **לפיתוח מקומי הוסף גם:**
   ```
   http://localhost:3000/auth/google/callback
   ```

3. לחץ **"Create"**

### 5.4 שמירת ה-Credentials

1. יופיע חלון עם **Client ID** ו-**Client Secret**
2. **העתק ושמור את שניהם!**

   ```
   GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrS
   GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback
   ```

> **אזהרה:** ה-Client Secret יוצג רק פעם אחת! אם איבדת אותו - צור Client ID חדש.

---

## שלב 6: פרסום האפליקציה (Production)

### 6.1 הגשה לאימות (אופציונלי אך מומלץ)

> **הערה:** בלי אימות, רק משתמשי Test יוכלו להתחבר (מגבלה של 100 משתמשים)

1. חזור ל-**"OAuth consent screen"**
2. לחץ **"Publish App"**
3. אם נדרש אימות נוסף - מלא את הטופס

### 6.2 דרישות לאימות (אם נדרש)

| פריט | מה לספק |
|------|---------|
| Privacy Policy URL | https://findo.co.il/privacy |
| Terms of Service URL | https://findo.co.il/terms |
| Homepage | https://findo.co.il |
| Logo | לוגו 120x120 פיקסלים |

---

# חלק ג': סיכום ה-Credentials

## קובץ .env המוכן

לאחר שהשלמת את כל השלבים, הוסף לקובץ `.env`:

```env
# ==========================================
# WhatsApp Business API (Meta)
# ==========================================
META_APP_ID=123456789012345
META_APP_SECRET=abcdef1234567890abcdef1234567890
META_CONFIG_ID=987654321098765

# ==========================================
# Google Business Profile API
# ==========================================
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrS
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback
```

---

## צ'קליסט להשלמה

### WhatsApp (Meta)

- [ ] יצרתי חשבון Meta Business
- [ ] העליתי מסמכים לאימות עסק
- [ ] קיבלתי אישור Business Verification
- [ ] יצרתי אפליקציה ב-Meta for Developers
- [ ] הוספתי WhatsApp Product לאפליקציה
- [ ] שמרתי את META_APP_ID
- [ ] שמרתי את META_APP_SECRET
- [ ] יצרתי Embedded Signup Configuration
- [ ] שמרתי את META_CONFIG_ID
- [ ] הגדרתי אמצעי תשלום
- [ ] הוספתי Privacy Policy URL
- [ ] העברתי את האפליקציה ל-Live Mode

### Google

- [ ] יצרתי פרויקט ב-Google Cloud Console
- [ ] מצאתי את Project Number
- [ ] הגשתי בקשה לגישה ל-API
- [ ] קיבלתי אישור (אימייל מ-Google)
- [ ] הפעלתי את כל 8 ה-APIs
- [ ] הגדרתי OAuth Consent Screen
- [ ] הוספתי את ה-Scope business.manage
- [ ] יצרתי OAuth Client ID
- [ ] שמרתי את GOOGLE_CLIENT_ID
- [ ] שמרתי את GOOGLE_CLIENT_SECRET
- [ ] הגדרתי את GOOGLE_REDIRECT_URI

---

## זמנים משוערים

| שלב | זמן עבודה | זמן המתנה |
|-----|-----------|-----------|
| Meta Business Verification | 30 דקות | 1-14 ימים |
| יצירת Meta App | 45 דקות | - |
| Google API Access Request | 30 דקות | 1-2 שבועות |
| הגדרת Google OAuth | 30 דקות | - |

**סה"כ:** ~2-3 שעות עבודה + עד 3 שבועות המתנה לאישורים

---

## פתרון בעיות נפוצות

### Meta

| בעיה | פתרון |
|------|-------|
| Business Verification נדחה | ודא שהמסמכים קריאים ושהשם תואם בדיוק |
| לא רואה WhatsApp Product | ודא שיש לך Business Account מחובר |
| Embedded Signup לא עובד | ודא שהאפליקציה ב-Live Mode |

### Google

| בעיה | פתרון |
|------|-------|
| לא רואה את ה-APIs | הבקשה עדיין לא אושרה - המתן |
| Error 403 בזמן OAuth | ודא שה-Scope נכון והמשתמש מורשה |
| Redirect URI mismatch | ודא שה-URI בקוד זהה בדיוק למה שהגדרת |

---

## קישורים חשובים

### Meta / WhatsApp
- [Meta for Developers](https://developers.facebook.com)
- [Meta Business Suite](https://business.facebook.com)
- [WhatsApp Business Platform](https://business.whatsapp.com/developers/developer-hub)
- [תמחור WhatsApp API](https://developers.facebook.com/docs/whatsapp/pricing)

### Google
- [Google Cloud Console](https://console.cloud.google.com)
- [טופס בקשת גישה ל-API](https://docs.google.com/forms/d/e/1FAIpQLSfC_FKSWzbSae_5rOpgwFeIUzXUF1JCQnlsZM_gC1I2UHjA3w/viewform)
- [תיעוד Business Profile API](https://developers.google.com/my-business)
- [OAuth Playground](https://developers.google.com/oauthplayground)

---

*נכתב עבור Findo - ינואר 2026*
