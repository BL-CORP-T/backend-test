/**
 * Собирает все JSON-файлы из seed-data/ в один файл dist/oge_bank.json,
 * который потом просто загружается в ваш GitHub-репозиторий — никакого
 * сервера, npm-пакетов или аккаунтов не требуется, только Node.js
 * (он уже есть, если вы ставили Android Studio с JS-плагинами, но проще
 * всего просто скачать Node с nodejs.org — это тоже бесплатно).
 *
 * Запуск:
 *   node scripts/build-bank.js
 *
 * Каждый запуск увеличивает версию банка на 1 (хранится в version.txt) —
 * именно по этому номеру версии приложение определяет, что появилось
 * обновление (см. BankSyncRepository.checkForUpdates в Android-проекте).
 */
const fs = require("fs");
const path = require("path");

const seedDir = path.join(__dirname, "..", "seed-data");
const distDir = path.join(__dirname, "..", "dist");
const versionFile = path.join(__dirname, "..", "version.txt");

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(seedDir, fileName), "utf-8"));
}

const subjects = readJson("subjects.json");
const topics = readJson("topics.json");
const questionFiles = ["questions_math_oge.json", "questions_rus_oge.json", "questions_phys_oge.json", "questions_test_oge.json"];
const questions = questionFiles.flatMap((file) => readJson(file));

let version = 1;
if (fs.existsSync(versionFile)) {
  version = parseInt(fs.readFileSync(versionFile, "utf-8").trim(), 10) + 1;
}
fs.writeFileSync(versionFile, String(version));

const bank = {
  version,
  generatedAt: new Date().toISOString(),
  subjects,
  topics,
  questions
};

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, "oge_bank.json"), JSON.stringify(bank, null, 2));

console.log(`Собрано: oge_bank.json, версия ${version}`);
console.log(`Предметов: ${subjects.length}, тем: ${topics.length}, заданий: ${questions.length}`);
console.log(`Не забудьте закоммитить и запушить dist/oge_bank.json и version.txt в GitHub.`);
