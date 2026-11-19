"""
Beginner-friendly explanation strings in English, Tamil, and Tanglish
(Tamil written with English letters), keyed by risk category / signal id.

This is a small, hand-curated dictionary for the prototype — in a
production system you would route this through a proper translation
pipeline and have it reviewed by native speakers. Keeping it explicit
and file-based (rather than machine-translated at request time) means
the wording is predictable and auditable, which matters for a safety
tool.
"""

from __future__ import annotations

SUMMARY_TEMPLATES = {
    "en": {
        "Low": "This message does not show the common scam patterns TrustShield AI checks for, but that is not a guarantee it is genuine.",
        "Medium": "This message has a few patterns that are sometimes used in scams. Be cautious and verify before acting.",
        "High": "This message matches several patterns commonly used in scam and phishing messages. Treat it as suspicious.",
        "Critical": "This message matches many high-risk scam patterns at once (such as urgent OTP or payment requests). Do not act on it without verifying through an official channel.",
    },
    "ta": {
        "Low": "இந்த செய்தியில் பொதுவான மோசடி அறிகுறிகள் எதுவும் இல்லை. ஆனால் இது நிச்சயமாக உண்மையானது என்று அர்த்தமல்ல.",
        "Medium": "இந்த செய்தியில் சில சந்தேகத்திற்குரிய அறிகுறிகள் உள்ளன. கவனமாக இருந்து, உறுதிப்படுத்தாமல் எதையும் செய்ய வேண்டாம்.",
        "High": "இந்த செய்தியில் மோசடி செய்திகளில் பொதுவாகக் காணப்படும் பல அறிகுறிகள் உள்ளன. இதை சந்தேகத்திற்குரியதாகக் கருதவும்.",
        "Critical": "இந்த செய்தியில் மிக அதிக ஆபத்தான பல அறிகுறிகள் (OTP, பணம் கோரிக்கை போன்றவை) ஒன்றாக உள்ளன. உறுதிப்படுத்தாமல் எதையும் செய்ய வேண்டாம்.",
    },
    "tanglish": {
        "Low": "இந்த message-la common scam patterns onnum theriala. Aனா idhu 100% genuine-nu guarantee illa.",
        "Medium": "இந்த message-la konjam suspicious patterns irukku. Careful-a iru, verify pannama onnum pannadheenga.",
        "High": "இந்த message-la scam/phishing messages-la usually irukkura patterns pala irukku. Idha suspicious-a nu nenaikkanum.",
        "Critical": "இந்த message-la romba high-risk patterns (OTP kekkardhu, panam transfer kekkardhu) ella onna sேrந்து irukku. Verify pannama edhuvume pannadheenga.",
    },
}

ACTIONS = {
    "en": [
        "Do not share OTP, PIN, CVV, passwords, or net-banking login with anyone — banks and government bodies never ask for these.",
        "Do not click links in the message. Open the official app or website yourself by typing the address directly.",
        "Verify the claim by calling the organisation's official number from their website, not a number given in the message.",
        "If money has already been sent or details already shared, call the national cyber-fraud helpline 1930 immediately and file a complaint at cybercrime.gov.in.",
    ],
    "ta": [
        "OTP, PIN, CVV, password, net-banking login ஆகியவற்றை யாருடனும் பகிர வேண்டாம் — வங்கிகள் மற்றும் அரசு துறைகள் இவற்றை ஒருபோதும் கேட்காது.",
        "செய்தியில் உள்ள இணைப்புகளை (links) கிளிக் செய்ய வேண்டாம். அதிகாரப்பூர்வ app/website-ஐ நீங்களே நேரடியாக திறக்கவும்.",
        "செய்தியில் உள்ள எண்ணை அல்ல, அதிகாரப்பூர்வ வலைதளத்தில் உள்ள எண்ணை அழைத்து உறுதிப்படுத்தவும்.",
        "ஏற்கனவே பணம் அனுப்பியிருந்தால் அல்லது விவரங்களை பகிர்ந்திருந்தால், உடனடியாக தேசிய சைபர் மோசடி உதவி எண் 1930-ஐ அழைத்து cybercrime.gov.in-இல் புகார் அளிக்கவும்.",
    ],
    "tanglish": [
        "OTP, PIN, CVV, password, net-banking login yarukkum share pannadheenga — banks and government ivangalunga ethuvume kekka maatanga.",
        "Message-la irukkura links-a click pannadheenga. Official app/website-a neengale type pannu, open pannunga.",
        "Message-la kudutha number-a kaekkama, official website-la irukkura number-a call panni verify pannunga.",
        "Already panam anuppirukinga or details share panniruntha, udane 1930 (national cyber fraud helpline) call pannunga and cybercrime.gov.in-la complaint podunga.",
    ],
}

SAFETY_TIPS = {
    "en": [
        "Banks, government departments, and RBI never call, SMS, or email to ask for your OTP, PIN, CVV, or full card number.",
        "Genuine KYC updates are done by visiting your bank/app in person or through the verified app — never through a link texted to you.",
        "A real job offer does not ask you to pay a 'registration' or 'processing' fee before you are hired.",
        "If an offer or warning creates panic and urgency ('act within 10 minutes' / 'account will be blocked today'), slow down — that pressure is itself a warning sign.",
    ],
    "ta": [
        "வங்கிகள், அரசு துறைகள், RBI ஆகியவை OTP, PIN, CVV அல்லது முழு கார்டு எண்ணைக் கேட்டு ஒருபோதும் அழைக்காது, SMS/email அனுப்பாது.",
        "உண்மையான KYC update வங்கி/app-ஐ நேரடியாக சென்று அல்லது verified app மூலமாகவே செய்யப்படும் — SMS-இல் வரும் link மூலம் அல்ல.",
        "உண்மையான வேலை வாய்ப்பு, வேலைக்கு முன் 'registration' அல்லது 'processing fee' கேட்காது.",
        "ஒரு செய்தி பதற்றத்தையும் அவசரத்தையும் உருவாக்கினால் ('10 நிமிடத்தில் செய்யுங்கள்' / 'இன்றே கணக்கு block ஆகும்'), மெதுவாக யோசியுங்கள் — அந்த அழுத்தமே ஒரு எச்சரிக்கை அறிகுறி.",
    ],
    "tanglish": [
        "Banks, government departments, RBI ivangalunga OTP, PIN, CVV, full card number kekka call pannadhu, SMS/email anuppadhu.",
        "Real KYC update bank/app-ku neraga poi or verified app mூlama dhan nadakum — SMS-la varra link mூlama illa.",
        "Real job offer-ku job kudukardhukku munnadiye 'registration' or 'processing fee' kekkadhu.",
        "Oru message panic and urgency create pannudhunna ('10 minute-la pannunga' / 'indha naiku account block aagum'), slow-a yosinga — andha pressure-e oru warning sign.",
    ],
}


def summary_for(language: str, category: str) -> str:
    lang = language if language in SUMMARY_TEMPLATES else "en"
    return SUMMARY_TEMPLATES[lang][category]


def actions_for(language: str) -> list[str]:
    lang = language if language in ACTIONS else "en"
    return ACTIONS[lang]


def safety_tips_for(language: str) -> list[str]:
    lang = language if language in SAFETY_TIPS else "en"
    return SAFETY_TIPS[lang]
