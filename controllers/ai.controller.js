import { cosineSimilarity, createEmbeddings, enhancePrompt } from "../ai/createEmbeddings.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { getGemsPromise } from "../repository/gem.repo.js";

const generateSuggestions = catchAsyncError(async (req, res, next) => {
    const userPrompt = req.body.prompt;
    const userVector = (await createEmbeddings(userPrompt));
    const gems = await getGemsPromise();
    const similarties = gems.map(gem => ({
        gem,
        score: cosineSimilarity(userVector, gem.embeddings || 0)
    }))
    // console.log(s.gem.name, "score:", cosineSimilarity(userVector, s.gem.embeddings.values));

    similarties.sort((a,b) => b.score - a.score);
    const THRESHOLD = 0.70;
  const relevant = similarties.filter(s => s.score >= THRESHOLD);
    const matches = similarties.slice(0, 3).map(s => {
            const {embeddings, ...gem} = s.gem.toObject();
            return gem;
        });
      console.log(matches);  
    if (relevant.length === 0) {
    return res.status(200).json({
      suggestions: null,
      allSuggestions: matches,
      message: "No relevant gems found in our website but you could like these picks.",
    });
  }     
    const firstMatch = matches.shift();   
    return res.status(200).json({
        suggestions: firstMatch,
        allSuggestions: matches,
        message: "Here is what we have."
    });
})

export {
    generateSuggestions, 
}