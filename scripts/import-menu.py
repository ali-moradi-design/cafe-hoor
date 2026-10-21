"""Builds content/categories.json and content/menu.json from the saved snapp-store menu
(content-raw/snapp-menu/menu-clean.json). Hookah is left out on purpose.
Usage: python scripts/import-menu.py ."""
import json, os, re, sys

root = sys.argv[1]
src = json.load(open(os.path.join(root, "content-raw/snapp-menu/menu-clean.json"), encoding="utf8"))

# Site categories in display order: (id, en, fa, snapp category titles). No hookah.
CATEGORIES = [
    ("breakfast", "Breakfast", "صبحانه", ["صبحانه"]),
    ("starters", "Starters & salads", "پیش‌غذا و سالاد", ["پیش غذا"]),
    ("iranian", "Iranian dishes", "غذای ایرانی", ["غذای ایرانی"]),
    ("pizza", "Pizza", "پیتزا", ["پیتزا رومانو"]),
    ("burgers-sandwiches", "Burgers & sandwiches", "برگر و ساندویچ", ["ساندویچ ها"]),
    ("pasta", "Pasta", "پاستا", ["پاستا"]),
    ("cakes", "Cakes & desserts", "کیک و دسر", ["کیک"]),
    ("coffee", "Coffee", "قهوه", ["قهوه"]),
    ("hot-drinks", "Hot drinks", "نوشیدنی گرم", ["گرم نوش"]),
    ("tea", "Tea & infusions", "چای و دمنوش", ["چای و دمنوش"]),
    ("mocktails", "Mocktails", "ماکتل", ["ماکتل"]),
    ("sharbat", "Persian sharbats", "شربت", ["شربت بار"]),
    ("smoothies", "Smoothies", "اسموتی", ["اسموتی ها"]),
    ("cold-drinks", "Cold drinks", "نوشیدنی سرد", ["نوشیبدنی سرد"]),
    ("shakes", "Shakes", "شیک", ["شیک ها"]),
    ("with-food", "Drinks with food", "نوشیدنی کنار غذا", ["نوشیدنی کنار غذا"]),
]

# fa title (whitespace-normalized) → (id, English name, English description).
EN = {
    "شاپوری": ("shapouri", "Shapouri", "Eggs in omelette sauce with beans, nigella seeds, pickles, onion and chilli"),
    "سرویس نان تنوری": ("tandoor-bread", "Tandoor bread", "A basket of fresh tandoor bread"),
    "نیمرو": ("fried-eggs", "Fried eggs", "Two eggs with tandoor bread and Lahijan black tea"),
    "املت گوجه": ("tomato-omelette", "Tomato omelette", "Two eggs in tomato sauce with tandoor bread and Lahijan black tea"),
    "بشقاب انگلیسی یک نفره": ("english-breakfast", "English breakfast", "Frankfurter, beef bacon, seasoned mushrooms, beans, an egg, roast potatoes, toast, tandoor bread and Lahijan black tea"),
    "سیب زمینی با سس قارچ": ("fries-mushroom-sauce", "Fries with mushroom sauce", "French fries topped with mushroom sauce"),
    "سیب زمینی ساده": ("fries", "French fries", "Golden French fries"),
    "حمص": ("hummus", "Hummus", "Chickpeas, tahini, garlic and lemon with Hoor bread"),
    "کشک بادمجان": ("kashk-bademjan", "Kashk-e bademjan", "Eggplant, walnuts and garlic, served with Hoor bread"),
    "سالاد سزار": ("caesar-salad", "Caesar salad", "Lettuce, olives, tomato, croutons, parmesan and grilled chicken"),
    "ماست موسیر": ("mast-o-musir", "Yogurt with shallots", "Thick yogurt with Persian shallots"),
    "سالاد سزار سوخاری": ("crispy-caesar-salad", "Crispy chicken Caesar", "Caesar salad with crispy fried chicken"),
    "کباب تابه ای": ("pan-kabab", "Pan kabab", "Iranian pan-cooked kabab, one serving"),
    "چلو جوجه": ("chelo-joojeh", "Chelo joojeh", "Saffron chicken kabab with Persian rice"),
    "چلو لقمه کباب": ("chelo-loghmeh", "Chelo loghmeh kabab", "Minced meat kabab with Persian rice"),
    "جوجه کباب چوبی": ("skewer-joojeh", "Chicken skewers", "Chicken kabab on wooden skewers, one serving"),
    "چلو کره": ("chelo-kareh", "Buttered rice", "Persian rice with butter"),
    "خوراک لقمه کباب": ("loghmeh-plate", "Loghmeh kabab plate", "Minced meat kabab without rice"),
    "خوراک جوجه": ("joojeh-plate", "Joojeh plate", "Saffron chicken kabab without rice"),
    "پپرونی": ("pepperoni-pizza", "Pepperoni", "Pomodoro sauce, pepperoni, mozzarella, jalapeño, mushrooms and olive oil"),
    "سیر و استیک": ("garlic-steak-pizza", "Garlic & steak", "Alfredo sauce, garlic, beef, mozzarella, mushrooms, black olives and olive oil"),
    "پیتزا ژامبون بوقلمون دودی": ("smoked-turkey-pizza", "Smoked turkey pizza", "Alfredo sauce, turkey bacon, mozzarella, mushrooms, olive oil and black olives"),
    "پیتزا بیکن گوشت": ("beef-bacon-pizza", "Beef bacon pizza", "Pizza with beef bacon"),
    "پیتزا چیکن باربیکیو": ("bbq-chicken-pizza", "BBQ chicken pizza", "Barbecue sauce, grilled chicken, mozzarella, mushrooms, black olives and olive oil"),
    "ماشروم برگر": ("mushroom-burger", "Mushroom burger", "Beef patty, burger bun, lettuce, caramelised onion and mushroom sauce"),
    "چیز برگر": ("cheeseburger", "Cheeseburger", "Beef patty, burger bun, lettuce, caramelised onion and gouda"),
    "برگر کلاسیک": ("classic-burger", "Classic burger", "Beef patty, burger bun, lettuce and caramelised onion"),
    "پنینی پارما بوقلمون": ("turkey-parma-panini", "Turkey parma panini", "Turkey ham, rocket, mushroom cheese, parmesan and tartar sauce"),
    "پنینی مرغ و دیپ بادمجان": ("chicken-eggplant-panini", "Chicken & eggplant dip panini", "Chicken breast, parmesan, mushroom cheese, sun-dried tomato, eggplant sauce and roast potatoes"),
    "گلدن چیکن برگر": ("golden-chicken-burger", "Golden chicken burger", "Crispy chicken breast, iceberg lettuce, mushroom cheese, parmesan and fries"),
    "اسپشیال برگر": ("special-burger", "Hoor special burger", "Beef patty, seasoned beef bacon, barbecue sauce, lettuce, onion, sun-dried tomato, mushroom cheese, parmesan and fries"),
    "چیکن آلفردو": ("chicken-alfredo", "Chicken alfredo", "Grilled chicken, penne, alfredo sauce and parmesan"),
    "لاوا کیک": ("lava-cake", "Lava cake", "Molten chocolate cake with vanilla ice cream"),
    "تیرامیسو کلاسیک": ("tiramisu", "Classic tiramisu", ""),
    "کیک شکلاتی": ("chocolate-cake", "Chocolate cake", ""),
    "سرویس باقلوا گردو": ("walnut-baklava", "Walnut baklava", "Three pieces of walnut baklava"),
    "چیز کیک روز": ("cheesecake", "Cheesecake of the day", ""),
    "اسپرسو": ("espresso", "Espresso", ""),
    "آمریکانو / آیس آمریکانو": ("americano", "Americano / iced americano", "Double espresso and hot water"),
    "کاپوچینو": ("cappuccino", "Cappuccino", "Double espresso and milk"),
    "کورتادو": ("cortado", "Cortado", ""),
    "ماهرخ": ("mahrokh", "Mahrokh", "Espresso, pineapple juice, passion fruit and Irish cream syrup"),
    "لاته /آیس لته": ("latte", "Latte / iced latte", "Double espresso and milk"),
    "لاته فندق / آیس لاته فندق": ("hazelnut-latte", "Hazelnut latte / iced", "Double espresso, milk and hazelnut syrup"),
    "لاته دارچین / آیس لاته دارچین": ("cinnamon-latte", "Cinnamon latte / iced", "Double espresso, milk and cinnamon syrup"),
    "لاته / آیس لاته وانیل": ("vanilla-latte", "Vanilla latte / iced", "Double espresso, milk and vanilla syrup"),
    "لاته شکلات/ آیس لاته شکلات (موکا)": ("mocha", "Mocha / iced mocha", "Double espresso, milk and chocolate syrup"),
    "لاته کارامل/ آیس لاته کارامل": ("caramel-latte", "Caramel latte / iced", "Double espresso, milk and caramel syrup"),
    "لاته نارگیل/ آیس لاته نارگیل": ("coconut-latte", "Coconut latte / iced", "Double espresso, milk and coconut syrup"),
    "آفوگاتو": ("affogato", "Affogato", "Espresso over vanilla ice cream"),
    "ترک": ("turkish-coffee", "Turkish coffee", ""),
    "شیر بیسکوییت داغ": ("hot-biscuit-milk", "Hot biscuit milk", "Milk, Madar biscuits and caramel sauce"),
    "هات چاکلت": ("hot-chocolate", "Hot chocolate", ""),
    "وایت چاکلت": ("white-chocolate", "White hot chocolate", ""),
    "ماسالا": ("masala-chai", "Masala chai", ""),
    "چای لاهیجان": ("lahijan-tea", "Lahijan tea", "Black tea from Lahijan"),
    "تبریز": ("tabriz-infusion", "Tabriz", "Dried quince, dried apple, pistachio, cardamom and saffron"),
    "چای گلچین": ("golchin-tea", "Golchin tea", "Black tea with cardamom, cinnamon and quince"),
    "دیبا": ("diba", "Diba", "Strawberry, passion fruit, pineapple and mango juice with soda"),
    "شهریار": ("shahriar", "Shahriar", "Cranberry, grenadine, wild plum and sour cherry juice"),
    "مهتاب": ("mahtab", "Mahtab", "Blue curaçao syrup, coconut syrup, apple juice, red grape juice and soda"),
    "یاقوت": ("yaghout", "Yaghout", "Pomegranate and sour cherry juice, jalapeño, lime and soda"),
    "لیموناد": ("lemonade", "Lemonade", "Lemon, sugar and soda"),
    "حریر": ("harir", "Harir", "Guava, lychee, pineapple juice and cactus juice"),
    "موهیتو": ("mojito", "Virgin mojito", "Lime, mint, rum syrup and soda"),
    "نسیم": ("nasim", "Nasim", "Rosewater, willow syrup, basil seeds, khakshir and apple juice"),
    "نوا": ("nava", "Nava", "Musk rose water, willow syrup, basil seeds, khakshir and sour cherry"),
    "زرین": ("zarrin", "Zarrin", "Saffron, basil seeds, khakshir, rosewater, cardamom and hibiscus"),
    "آبمیوه فصل": ("seasonal-juice", "Seasonal juice", "Fresh watermelon, rosewater and lime"),
    "عقیق": ("aghigh", "Aghigh", "Sour cherry, raspberry, wild plum, salt and lime"),
    "آفتاب": ("aftab", "Aftab", "Mango, banana, peach juice and willow syrup"),
    "جگر گشای جنگلی": ("wild-berry-float", "Wild berry float", "Wild plum juice with mulberry ice cream"),
    "هویج بستنی": ("carrot-ice-cream", "Carrot juice & ice cream", "Fresh carrot juice with Persian ice cream"),
    "خزان": ("khazan", "Khazan", "Black tea, willow syrup, lime, pumpkin spice and passion fruit"),
    "شیک شکلات اورئو": ("oreo-shake", "Chocolate Oreo shake", "Vanilla ice cream, chocolate cream and Oreo"),
    "شیک مخمل": ("makhmal-shake", "Makhmal shake", "Vanilla ice cream, banana, mango juice, coconut syrup and guava"),
    "شیک ترد نمکی": ("salty-crunch-shake", "Salty crunch shake", "Vanilla ice cream, peanut butter and salty crackers"),
    "شیک نوستالژی": ("nostalgia-shake", "Nostalgia shake", "Vanilla ice cream, banana, cardamom, walnut and masala"),
    "سایه": ("sayeh", "Sayeh", "Cola, kiwi syrup, lime and apple juice"),
    "سرویس آبجو": ("beer", "Non-alcoholic beer", ""),
    "دوغ": ("doogh", "Doogh", "Persian yogurt drink"),
    "سودا لیمو": ("lime-soda", "Lime soda", "Soda and lime"),
    "آذر": ("azar", "Azar", "Orange soda, strawberry syrup and peach juice"),
}
PHOTO = {"english-breakfast": "english-breakfast", "pepperoni-pizza": "pepperoni", "special-burger": "special-burger", "chelo-joojeh": "chelo-joojeh", "chelo-loghmeh": "chelo-kabab", "yaghout": "yaghout", "hummus": "hummus", "caesar-salad": "caesar-salad", "kashk-bademjan": "kashk-bademjan"}
SIGNATURE = {"english-breakfast", "chelo-joojeh", "pepperoni-pizza", "special-burger", "hummus", "yaghout"}
FA_NAME_FIX = {
    "لاته /آیس لته": "لاته / آیس لاته",
    "لاته / آیس لاته وانیل": "لاته وانیل / آیس لاته وانیل",
    "سرویس آبجو": "آبجو بدون الکل",
}


def norm(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def clean_fa(text: str, title: str) -> str:
    text = norm(text)
    if text in {"", ".", title}:
        return ""
    parts = [p.strip() for p in re.split(r"\s*(?:--|[.\-/،ـ])\s*", text) if p.strip()]
    return "، ".join(parts).replace("سیرودارچین", "سیروپ دارچین").replace("شربیت", "شربت").replace("دوعدد", "دو عدد")


by_title = {norm(c["title"]): c for c in src}
categories, items, missing = [], [], []
for cid, en, fa, sources in CATEGORIES:
    categories.append({"id": cid, "title": {"en": en, "fa": fa}})
    for s in sources:
        for it in by_title[s]["items"]:
            if not (it["active"] and it["available"] and it["price"] > 0):
                continue
            title = norm(it["title"])
            if title not in EN:
                missing.append(title)
                continue
            iid, en_name, en_desc = EN[title]
            items.append({
                "id": iid,
                "category": cid,
                "signature": iid in SIGNATURE,
                "name": {"en": en_name, "fa": FA_NAME_FIX.get(title, title)},
                "description": {"en": en_desc, "fa": clean_fa(it["description"], title)},
                "price": it["price"],
                **({"photo": PHOTO[iid]} if iid in PHOTO else {}),
            })
assert not missing, missing
assert len({i["id"] for i in items}) == len(items), "duplicate ids"
for name, data in (("categories", categories), ("menu", items)):
    with open(os.path.join(root, f"content/{name}.json"), "w", encoding="utf8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
print(len(categories), "categories,", len(items), "items")
