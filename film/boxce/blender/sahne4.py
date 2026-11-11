"""BOXÇE — Sahne 4: İstanbul inşaatı, bohça açılıyor.

Çalıştırma:
  blender -b -P sahne4.py -- --out /yol/cikti/ [--still] [--cam genis|yakin]

Karakter yok; sadece mekân + bohça. Toon görünüm: Diffuse -> Shader to RGB ->
sabit renk rampası (EEVEE) + Freestyle kontur.
"""
import bpy, math, sys, random, argparse
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--out", default="/tmp/sahne4/")
ap.add_argument("--still", action="store_true")
ap.add_argument("--cam", default="genis")
ap.add_argument("--frame", type=int, default=100)
ap.add_argument("--res", type=int, default=100)
args = ap.parse_args(argv)
random.seed(7)

# ---------- temizle ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.fps = 24
sc.frame_start, sc.frame_end = 1, 120

def hexcol(h, a=1.0):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    # sRGB -> linear
    c = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return (*c, a)

# ---------- toon materyal ----------
_mats = {}
def toon(name, color, shadow=0.55, mid=0.8):
    if name in _mats:
        return _mats[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    dif = nt.nodes.new("ShaderNodeBsdfDiffuse")
    s2r = nt.nodes.new("ShaderNodeShaderToRGB")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    mul = nt.nodes.new("ShaderNodeMix")
    mul.data_type = "RGBA"
    mul.blend_type = "MULTIPLY"
    mul.inputs[0].default_value = 1.0
    emi = nt.nodes.new("ShaderNodeEmission")
    ramp.color_ramp.interpolation = "CONSTANT"
    e = ramp.color_ramp.elements
    e[0].position, e[0].color = 0.0, (shadow, shadow, shadow * 1.04, 1)
    e[1].position, e[1].color = 0.12, (mid, mid, mid, 1)
    e.new(0.45).color = (1, 1, 1, 1)
    nt.links.new(dif.outputs[0], s2r.inputs[0])
    nt.links.new(s2r.outputs[0], ramp.inputs[0])
    nt.links.new(ramp.outputs[0], mul.inputs[6])
    mul.inputs[7].default_value = hexcol(color)
    nt.links.new(mul.outputs[2], emi.inputs[0])
    nt.links.new(emi.outputs[0], out.inputs[0])
    _mats[name] = m
    return m

def put(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    return obj

def box(name, size, loc, mat, rot=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        b = o.modifiers.new("bv", "BEVEL")
        b.width, b.segments = bevel, 2
    return put(o, mat)

def cyl(name, r, h, loc, mat, rot=(0, 0, 0), v=12):
    bpy.ops.mesh.primitive_cylinder_add(vertices=v, radius=r, depth=h, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    return put(o, mat)

def ball(name, r, loc, mat, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=r, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    bpy.ops.object.shade_smooth()
    return put(o, mat)

# ---------- palet ----------
BETON = toon("beton", "#8d8c88", 0.62)
BETON_K = toon("beton_koyu", "#6f6f6c", 0.65)
DEMIR = toon("demir", "#5a4a42", 0.6)
ISKELE = toon("iskele", "#7d8288", 0.6)
VINC = toon("vinc", "#9a9c9e", 0.75)
KIRMIZI = toon("bohca", "#B3262E", 0.5, 0.78)
KIRMIZI_IC = toon("bohca_ic", "#8E1C24", 0.55)
SARI_ISLEME = toon("isleme_sari", "#D9A93A", 0.55)
YESIL_ISLEME = toon("isleme_yesil", "#4E7A4A", 0.55)
KETE = toon("kete", "#D8A35A", 0.6)
PEYNIR = toon("peynir", "#EFE8D2", 0.7)
DUT = toon("dut", "#E3D3A8", 0.6)
NOHUT = toon("nohut", "#C79A5B", 0.6)
KAGIT = toon("kagit", "#EFEBE2", 0.75)
KALEM = toon("kalem", "#3B3A3F", 1.0, 1.0)
BARET = toon("baret", "#B8A15A", 0.6)

# ---------- mekân ----------
box("zemin", (40, 40, 0.1), (0, 0, -0.05), BETON)
box("blok", (1.4, 0.7, 0.45), (0, 0, 0.225), BETON_K, bevel=0.015)
# arka kolonlar + üst döşeme + filiz demirleri
for ix in range(-3, 4):
    for iy in (3, 7):
        x, y = ix * 3.2, iy
        box(f"kolon_{ix}_{iy}", (0.4, 0.4, 3.2), (x, y, 1.6), BETON)
box("doseme", (22, 5.2, 0.25), (0, 5, 3.3), BETON_K)
for ix in range(-3, 4):
    for k in range(4):
        x = ix * 3.2 + (k % 2 - 0.5) * 0.25
        y = 7 + (k // 2 - 0.5) * 0.25
        cyl(f"filiz_{ix}_{k}", 0.015, 1.1, (x, y, 3.95 + random.uniform(-0.1, 0.1)), DEMIR,
            rot=(random.uniform(-0.12, 0.12), random.uniform(-0.12, 0.12), 0), v=6)
# iskele (sağ)
for i in range(4):
    for j in range(2):
        cyl(f"isk_d_{i}_{j}", 0.03, 6, (4.2 + i * 1.2, 2.2 + j * 1.0, 3), ISKELE, v=6)
    for z in (1.0, 2.5, 4.0, 5.5):
        cyl(f"isk_y_{i}_{z}", 0.025, 1.0, (4.2 + i * 1.2, 2.7, z), ISKELE, rot=(math.pi / 2, 0, 0), v=6)
for z in (1.0, 2.5, 4.0, 5.5):
    cyl(f"isk_x_{z}", 0.025, 3.6, (6.0, 2.2, z), ISKELE, rot=(0, math.pi / 2, 0), v=6)
# uzak vinç silüeti
box("vinc_kule", (0.5, 0.5, 22.4), (-9, 30, 11.2), VINC)
box("vinc_kol", (16, 0.4, 0.4), (-4, 30, 22.6), VINC)
box("vinc_karsi", (2, 0.8, 0.8), (-13.5, 30, 22.4), VINC)
cyl("vinc_halat", 0.02, 9, (3, 30, 18), VINC, v=4)
# baret (Ronî'ın), soluk sarı
ball("baret", 0.15, (-0.48, 0.08, 0.45), BARET, scale=(1, 1.15, 0.75))
cyl("baret_siper", 0.17, 0.015, (-0.48, 0.06, 0.455), BARET, v=20)

# ---------- bohça ----------
S = 0.40            # taban kenarı
D = 0.30            # kanat uzunluğu
TOP = 0.45          # blok üstü
CX, CY = 0.12, -0.02
base = box("bohca_taban", (S, S, 0.006), (CX, CY, TOP + 0.003), KIRMIZI)
base.rotation_euler.z = math.radians(8)

def flap(name, side_angle):
    """Tabanın bir kenarına menteşeli üçgen kanat. Origin = kenar ortası."""
    me = bpy.data.meshes.new(name)
    # üçgeni N'lik barisentrik ızgaraya böl (kenar x ekseni, uç +y)
    N = 10
    A, B, C = Vector((-S / 2, 0, 0)), Vector((S / 2, 0, 0)), Vector((0, D, 0))
    idx, verts, faces = {}, [], []
    for i in range(N + 1):
        for j in range(N + 1 - i):
            idx[(i, j)] = len(verts)
            verts.append(A + (B - A) * (i / N) + (C - A) * (j / N))
    for i in range(N):
        for j in range(N - i):
            faces.append((idx[(i, j)], idx[(i + 1, j)], idx[(i, j + 1)]))
            if i + j < N - 1:
                faces.append((idx[(i + 1, j)], idx[(i + 1, j + 1)], idx[(i, j + 1)]))
    me.from_pydata([tuple(v) for v in verts], [], faces)
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    # dolgun: kapalıyken içerik kanadı dışa iter (yerel -z)
    o.shape_key_add(name="Basis")
    sk = o.shape_key_add(name="dolgun")
    for k, v in enumerate(verts):
        # kenarlarda 0, ortada en fazla
        i_, j_ = [key for key, val in idx.items() if val == k][0]
        w = (i_ / N) * (j_ / N) * ((N - i_ - j_) / N) * 27  # 0..1
        sk.data[k].co.z -= 0.075 * w
    for poly in me.polygons:
        poly.use_smooth = True
    sol = o.modifiers.new("kalinlik", "SOLIDIFY")
    sol.thickness = 0.006
    put(o, KIRMIZI)
    o.data.materials.append(KIRMIZI_IC)
    sol.material_offset = 1
    # menteşe pivotu (dünya koordinatı; tabanın dönüşü dahil)
    piv = bpy.data.objects.new(name + "_piv", None)
    bpy.context.collection.objects.link(piv)
    a = side_angle + base.rotation_euler.z
    piv.location = (CX + math.cos(a) * S / 2, CY + math.sin(a) * S / 2, TOP + 0.006)
    piv.rotation_euler = (0, 0, a - math.pi / 2)
    o.parent = piv
    return o, piv

flaps = [flap(f"kanat_{i}", i * math.pi / 2) for i in range(4)]
# kilim işlemesi: kanatların ucuna küçük eşkenar dörtgenler
for i, (f, piv) in enumerate(flaps):
    for k, (m, off) in enumerate(((SARI_ISLEME, 0.20), (YESIL_ISLEME, 0.13), (SARI_ISLEME, 0.06))):
        bpy.ops.mesh.primitive_plane_add(size=0.035, location=(0, off, 0.0075),
                                         rotation=(0, 0, math.pi / 4))
        d = bpy.context.object
        d.name = f"isleme_{i}_{k}"
        put(d, m)
        d.parent = f

# düğüm (kapalıyken tepede): sıkıştırılmış top + iki sarkan bez ucu
H = D * math.sin(math.radians(131.8))
knot = ball("dugum", 0.04, (CX, CY, TOP + H + 0.01), KIRMIZI, scale=(1.2, 1.0, 0.75))
tails = []
for i, sgn in enumerate((1, -1)):
    bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.035, radius2=0.004, depth=0.11,
                                    location=(CX + sgn * 0.055, CY - 0.01, TOP + H + 0.03),
                                    rotation=(0.15, sgn * math.radians(-58), 0))
    t = bpy.context.object
    t.name = f"dugum_uc_{i}"
    t.scale = (1, 0.35, 1)
    put(t, KIRMIZI)
    tails.append(t)

# içindekiler (taban yerel koordinatı)
def child(o):
    return o  # taban sabit; bağlamaya gerek yok

def at(x, y, z=0):
    v = base.matrix_world @ Vector((x, y, 0))
    return (v.x, v.y, TOP + 0.006 + z)

bpy.context.view_layer.update()
for i, (x, y) in enumerate(((-0.08, 0.08), (-0.075, 0.085), (-0.083, 0.078))):
    k = cyl(f"kete_{i}", 0.065, 0.025, at(x, y, 0.0125 + i * 0.026), KETE, v=24)
    k.rotation_euler = (random.uniform(-.05, .05), random.uniform(-.05, .05), 0)
    child(k)
child(box("peynir", (0.09, 0.07, 0.05), at(0.07, 0.09, 0.025), PEYNIR, bevel=0.008))
for i in range(9):
    child(ball(f"dut_{i}", 0.012, at(0.135 + random.uniform(-.025, .025), -0.01 + random.uniform(-.03, .03), 0.012), DUT,
               scale=(1, 1, 1.4)))
for i in range(14):
    child(ball(f"nohut_{i}", 0.009, at(-0.135 + random.uniform(-.025, .025), -0.02 + random.uniform(-.035, .035), 0.009), NOHUT))

# not kâğıdı + yazı
note = box("not", (0.15, 0.11, 0.002), at(0.0, -0.06, 0.002), KAGIT)
note.rotation_euler = (0, 0, math.radians(-6))
child(note)
# kâğıdın gerçek (dünya) konumu
bpy.context.view_layer.update()
_nv = [note.matrix_world @ v.co for v in note.data.vertices]
NOTE_C = sum(_nv, Vector()) / len(_nv)
NOTE_TOP = max(v.z for v in _nv)
_rz = note.rotation_euler.z

# el yazısı: her harf ayrı nesne; yeni öğrenen bir elin titrekliği
LINES = ["KURÊ MIN.", "BIRÇÎ", "NEMÎNE.", "  DAYIKA TE"]
rnd = random.Random(62)
for li, line in enumerate(LINES):
    x = -0.064 + rnd.uniform(-0.003, 0.003)
    y = 0.036 - li * 0.026
    for ci, ch in enumerate(line):
        size = 0.017 * rnd.uniform(0.85, 1.2)
        if ch == " ":
            x += 0.010
            continue
        cd = bpy.data.curves.new(f"harf_{li}_{ci}", "FONT")
        cd.body = ch
        cd.size = size
        cd.extrude = 0.0
        o = bpy.data.objects.new(f"harf_{li}_{ci}", cd)
        bpy.context.collection.objects.link(o)
        cd.materials.append(KALEM)
        off = Vector((x, y + rnd.uniform(-0.0025, 0.0025) + li * 0.0, 0))
        off.rotate(note.rotation_euler)
        o.location = (NOTE_C.x + off.x, NOTE_C.y + off.y, NOTE_TOP + 0.0005)
        o.rotation_euler = (0, 0, _rz + math.radians(rnd.uniform(-12, 12)))
        bpy.context.view_layer.update()
        x += o.dimensions.x + 0.0025 + rnd.uniform(0.0, 0.0025)
    # satırlar hafif aşağı kayıyor (çizgisiz kâğıtta tipik)

# ---------- animasyon ----------
CLOSED = math.radians(131.8)
def key_flaps(frame, ang):
    for f, piv in flaps:
        f.rotation_euler = (ang, 0, 0)
        f.keyframe_insert("rotation_euler", frame=frame)

# kanat yerel x ekseni etrafında döner; +y dışa doğru, yukarı kalkması için +x açı
key_flaps(1, CLOSED)
key_flaps(40, CLOSED)
key_flaps(58, math.radians(70))
key_flaps(72, math.radians(-6))   # biraz taşar
key_flaps(80, 0.0)
for f, piv in flaps:
    kb = f.data.shape_keys.key_blocks["dolgun"]
    kb.value = 1.0
    kb.keyframe_insert("value", frame=40)
    kb.value = 0.0
    kb.keyframe_insert("value", frame=62)
    kb.value = 1.0
    kb.keyframe_insert("value", frame=1)
for o in [knot] + tails:
    o.keyframe_insert("scale", frame=34)
    s = o.scale.copy()
    o.scale = (0.001, 0.001, 0.001)
    o.keyframe_insert("scale", frame=42)
    o.scale = s
    o.keyframe_insert("scale", frame=34)
for f, piv in flaps:
    if f.animation_data and f.animation_data.action:
        for fc in f.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = "BEZIER"
                kp.easing = "EASE_IN_OUT"

# ---------- ışık / dünya ----------
world = bpy.data.worlds.new("gok")
sc.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = hexcol("#B9C0C6")
world.node_tree.nodes["Background"].inputs[1].default_value = 1.0
sun_d = bpy.data.lights.new("gunes", "SUN")
sun_d.energy = 3.0
sun_d.angle = math.radians(8)
sun = bpy.data.objects.new("gunes", sun_d)
bpy.context.collection.objects.link(sun)
sun.rotation_euler = (math.radians(50), math.radians(10), math.radians(-35))

# ---------- kameralar ----------
def camera(name, loc, target, lens):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.clip_end = 200
    c = bpy.data.objects.new(name, cd)
    bpy.context.collection.objects.link(c)
    c.location = loc
    d = Vector(target) - Vector(loc)
    c.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return c

cams = {
    # Ozu: alçak, sabit, göz hizasının altı
    "genis": camera("cam_genis", (0.55, -1.45, 0.78), (0.08, 0.25, 0.52), 35),
    "yakin": camera("cam_yakin", (NOTE_C.x + 0.03, NOTE_C.y - 0.17, NOTE_C.z + 0.26), (NOTE_C.x, NOTE_C.y + 0.005, NOTE_C.z), 50),
}
sc.camera = cams[args.cam]

# ---------- render ayarları ----------
r = sc.render
r.engine = "BLENDER_EEVEE"
sc.eevee.taa_render_samples = 16
r.resolution_x, r.resolution_y = 1280, 720
r.resolution_percentage = args.res
sc.view_settings.view_transform = "Standard"
sc.view_settings.look = "None"
r.use_freestyle = True
r.line_thickness_mode = "ABSOLUTE"
r.line_thickness = 1.3
ls = sc.view_layers[0].freestyle_settings.linesets[0] if sc.view_layers[0].freestyle_settings.linesets else \
    sc.view_layers[0].freestyle_settings.linesets.new("kontur")
if ls.linestyle is None:
    ls.linestyle = bpy.data.linestyles.new("kontur")
ls.linestyle.color = (0.08, 0.07, 0.07)
ls.linestyle.thickness = 1.3
ls.select_by_visibility = True
ls.select_silhouette = ls.select_border = ls.select_crease = True
r.image_settings.file_format = "PNG"

if args.still:
    sc.frame_set(args.frame)
    r.filepath = f"{args.out}{args.cam}_{args.frame:03d}.png"
    bpy.ops.render.render(write_still=True)
else:
    r.filepath = f"{args.out}{args.cam}_"
    bpy.ops.render.render(animation=True)
